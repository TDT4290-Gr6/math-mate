import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { userPresenter } from '../presenters/user.presenter';
import { InputParseError } from '@/entities/errors/common';

export type IGetUserController = ReturnType<typeof getUserController>;

/**
 * Factory function that creates the `getUserController`.
 *
 * @param getUserUseCase - Use case to retrieve a user's data by their ID.
 * @param authenticationService - Service to verify if the user is authenticated and obtain their ID.
 * @returns A controller function that:
 *   - Ensures the user is authenticated,
 *   - Retrieves the current user's ID from the authentication service,
 *   - Fetches the user's data from the use case,
 *   - Formats the user data using the presenter.
 *
 * @throws UnauthenticatedError - If the user is not logged in or user ID is not set.
 * @throws InputParseError - If the user cannot be found in the repository.
 *
 * @example
 * const controller = getUserController(getUserUseCase, authService);
 * const formattedUser = await controller();
 */
export const getUserController =
    (
        getUserUseCase: IGetUserUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async () => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated)
            throw new UnauthenticatedError('User must be logged in.');

        const userId = await authenticationService.getCurrentUserId();
        if (userId == null)
            throw new UnauthenticatedError('User id is not set.');

        const user = await getUserUseCase(userId);
        if (!user) throw new InputParseError('User not found');

        return userPresenter(user);
    };
