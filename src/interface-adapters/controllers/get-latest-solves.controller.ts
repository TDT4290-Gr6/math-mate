import type { IGetLatestSolvesUseCase } from '@/application/use-cases/get-latest-solves.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { getLatestSolvesPresenter } from '../presenters/get-latest-solves.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';

export type IGetLatestSolvesController = ReturnType<
    typeof getLatestSolvesController
>;

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
