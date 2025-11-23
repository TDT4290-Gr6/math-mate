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

/**
 * Factory function that creates the `getProblemsController`.
 *
 * @param getProblemsUseCase - Use case responsible for fetching problems with pagination and filtering.
 * @param getUserUseCase - Use case to retrieve the current user's data (e.g., score).
 * @param authenticationService - Service to verify if the user is authenticated and obtain their ID.
 * @returns A controller function that:
 *   - Validates input parameters (offset, limit, optional subjects),
 *   - Ensures the user is authenticated,
 *   - Fetches the current user's data,
 *   - Retrieves problems according to pagination, subjects, and user score,
 *   - Formats the problems using the presenter.
 *
 * @throws UnauthenticatedError - If the user is not logged in or user ID is not set.
 * @throws InputParseError - If the input is invalid (e.g., negative offset, excessive limit) or the user is not found.
 *
 * @example
 * const controller = getProblemsController(getProblemsUseCase, getUserUseCase, authService);
 * const formattedProblems = await controller({ offset: 0, limit: 10, subjects: ['Algebra'] });
 */
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
