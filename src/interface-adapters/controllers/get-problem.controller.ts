import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetProblemUseCase } from '@/application/use-cases/get-problem.use-case';
import { problemPresenter } from '../presenters/problem.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    problemId: z.int().nonnegative(),
});

export type IGetProblemInput = z.infer<typeof inputSchema>;
export type IGetProblemController = ReturnType<typeof getProblemController>;

export const getProblemController =
    (
        getProblemUseCase: IGetProblemUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: IGetProblemInput) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const result = inputSchema.safeParse(input);

        if (!result.success) {
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const { problemId } = result.data;

        const problem = await getProblemUseCase(problemId);

        return problemPresenter(problem);
    };
