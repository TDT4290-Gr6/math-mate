import type { IGetLatestSolvesUseCase } from '@/application/use-cases/get-latest-solves.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { getLatestSolvesPresenter } from '../presenters/get-latest-solves.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';

export type IGetLatestSolvesController = ReturnType<
    typeof getLatestSolvesController
>;

/**
 * Creates a controller that returns the latest solves for the currently authenticated user.
 *
 * The outer function is to be handled by dependency injection, and relies on authentication service
 * and the getLatestSolves use case.
 *
 * The inner function performs the following steps:
 * 1. Checks if the user is authenticated using the authentication service.
 * 2. Retrieves the current user's ID from the authentication service.
 * 3. Calls the getLatestSolves use case with the user ID to fetch the latest solves.
 * 4. Returns the solves formatted by the getLatestSolves presenter.
 *
 * @returns A list of the latest solves for the authenticated user.
 * @throws {UnauthenticatedError} If the user is not authenticated.
 */
export const getLatestSolvesController =
    (
        authenticationService: IAuthenticationService,
        getLatestSolvesUseCase: IGetLatestSolvesUseCase,
    ) =>
    async () => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated)
            throw new UnauthenticatedError('User must be logged in.');

        const userId = await authenticationService.getCurrentUserId();
        if (userId === null)
            throw new UnauthenticatedError('User ID not found.');

        const solves = await getLatestSolvesUseCase(userId);

        return getLatestSolvesPresenter(solves);
    };
