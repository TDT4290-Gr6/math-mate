import type { IGetProblemsUseCase } from '@/application/use-cases/get-problems.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { problemPresenter } from '../presenters/problem.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    offset: z.number().nonnegative(),
    limit: z.number().positive(),
    subjects: z.array(z.string()).optional(),
});

export type IGetProblemsInput = z.infer<typeof inputSchema>;
export type IGetProblemsController = ReturnType<typeof getProblemsController>;

export const getProblemsController =
    (
        getProblemsUseCase: IGetProblemsUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: IGetProblemsInput) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const result = inputSchema.safeParse(input);

        if (!result.success) {
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const { offset, limit, subjects } = result.data;

        const problems = await getProblemsUseCase(offset, limit, subjects);

        return problemPresenter(problems);
    };
