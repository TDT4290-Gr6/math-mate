import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { userPresenter } from '../presenters/user.presenter';
import { InputParseError } from '@/entities/errors/common';

export type IGetUserController = ReturnType<typeof getUserController>;

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
        if (!userId) throw new UnauthenticatedError('User id is not set.');

        const user = await getUserUseCase(userId);
        if (!user) throw new InputParseError('User not found');

        return userPresenter(user);
    };
