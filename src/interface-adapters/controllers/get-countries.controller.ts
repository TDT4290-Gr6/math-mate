import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetCountriesUseCase } from '@/application/use-cases/get-countries.use-case';
import { countryPresenter } from '../presenters/country.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';

export type IGetCountriesController = ReturnType<typeof getCountriesController>;

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
