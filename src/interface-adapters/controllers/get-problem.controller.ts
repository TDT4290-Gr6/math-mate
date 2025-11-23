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

/**
 * Factory function that creates the `getProblemController`.
 *
 * @param getProblemUseCase - Use case responsible for fetching a single problem by ID.
 * @param authenticationService - Service to verify if the user is authenticated.
 * @returns A controller function that validates input, ensures the user is authenticated,
 *          fetches the problem, and formats it using the presenter.
 *
 * @throws UnauthenticatedError - If the user is not logged in.
 * @throws InputParseError - If the input is invalid (e.g., negative or missing problemId).
 *
 * @example
 * const controller = getProblemController(getProblemUseCase, authService);
 * const formattedProblem = await controller({ problemId: 42 });
 */
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
