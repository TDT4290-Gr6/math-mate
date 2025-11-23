import { createCountryController } from '@/interface-adapters/controllers/create-country.controller';
import { getCountriesController } from '@/interface-adapters/controllers/get-countries.controller';
import { MockCountriesRepository } from '@/infrastructure/repositories/countries.repository.mock';
import { CountriesRepository } from '@/infrastructure/repositories/countries.repository';
import { createCountryUseCase } from '@/application/use-cases/create-country.use-case';
import { getCountriesUseCase } from '@/application/use-cases/get-countries.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

/**
 * countriesModule
 *
 * Configures and returns the dependency injection module for country-related services.
 *
 * - Binds `ICountriesRepository` to a mock implementation (`MockCountriesRepository`) when testing,
 *   or to the real `CountriesRepository` in production.
 * - Binds `ICreateCountryController` to `createCountryController`, injecting the `ICreateCountryUseCase`
 *   and `IAuthenticationService`.
 * - Binds `IGetCountriesController` to `getCountriesController`, injecting the `IGetCountriesUseCase`
 *   and `IAuthenticationService`.
 * - Binds `ICreateCountryUseCase` to `createCountryUseCase`, injecting the `ICountriesRepository`.
 * - Binds `IGetCountriesUseCase` to `getCountriesUseCase`, injecting the `ICountriesRepository`.
 *
 * This module centralizes all dependencies for country management within the application.
 *
 * @returns {Module} The configured DI module for country-related services.
 */
export function countriesModule() {
    const countriesModule = createModule();
    if (process.env.NODE_ENV === 'test') {
        countriesModule
            .bind(DI_SYMBOLS.ICountriesRepository)
            .toClass(MockCountriesRepository);
    } else {
        countriesModule
            .bind(DI_SYMBOLS.ICountriesRepository)
            .toClass(CountriesRepository);
    }
    countriesModule
        .bind(DI_SYMBOLS.ICreateCountryController)
        .toHigherOrderFunction(createCountryController, [
            DI_SYMBOLS.ICreateCountryUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    countriesModule
        .bind(DI_SYMBOLS.IGetCountriesController)
        .toHigherOrderFunction(getCountriesController, [
            DI_SYMBOLS.IGetCountriesUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);
    countriesModule
        .bind(DI_SYMBOLS.ICreateCountryUseCase)
        .toHigherOrderFunction(createCountryUseCase, [
            DI_SYMBOLS.ICountriesRepository,
        ]);

    countriesModule
        .bind(DI_SYMBOLS.IGetCountriesUseCase)
        .toHigherOrderFunction(getCountriesUseCase, [
            DI_SYMBOLS.ICountriesRepository,
        ]);
    return countriesModule;
}
