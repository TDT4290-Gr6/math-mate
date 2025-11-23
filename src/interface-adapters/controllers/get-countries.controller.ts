import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetCountriesUseCase } from '@/application/use-cases/get-countries.use-case';
import { countryPresenter } from '../presenters/country.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';

export type IGetCountriesController = ReturnType<typeof getCountriesController>;

/**
 * Factory function that creates the `getCountriesController`.
 *
 * @param getCountriesUseCase - Use case responsible for fetching all countries.
 * @param authenticationService - Service to verify if the user is authenticated.
 * @returns A controller function that ensures the user is authenticated,
 *          fetches the list of countries, and formats them using the presenter.
 *
 * @throws UnauthenticatedError - If the user is not logged in.
 *
 * @example
 * const controller = getCountriesController(getCountriesUseCase, authService);
 * const countries = await controller();
 * // countries -> formatted list of countries
 */
export const getCountriesController =
    (
        getCountriesUseCase: IGetCountriesUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async () => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const countries = await getCountriesUseCase();
        return countryPresenter(countries);
    };
