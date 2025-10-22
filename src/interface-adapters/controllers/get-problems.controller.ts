import type { IGetProblemsUseCase } from '@/application/use-cases/get-problems.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { problemsPresenter } from '../presenters/problems.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    offset: z.int().nonnegative(),
    limit: z.int().positive().max(100),
    subjects: z.array(z.string()).optional(),
});

export type IGetProblemsInput = z.infer<typeof inputSchema>;
export type IGetProblemsController = ReturnType<typeof getProblemsController>;

export const getProblemsController =
    (
        getProblemsUseCase: IGetProblemsUseCase,
        getUserUseCase: IGetUserUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: IGetProblemsInput) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const userId = await authenticationService.getCurrentUserId();
        if (userId == null)
            throw new UnauthenticatedError('User id is not set.');

        const user = await getUserUseCase(userId);
        if (!user) throw new InputParseError('User not found');

        const result = inputSchema.safeParse(input);

        if (!result.success) {
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const { offset, limit, subjects } = result.data;

        const problems = await getProblemsUseCase(
            offset,
            limit,
            userId,
            user.score,
            subjects,
        );

        return problemsPresenter(problems);
    };
