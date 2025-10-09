import { createCountryController } from '@/interface-adapters/controllers/create-country.controller';
import { MockCountriesRepository } from '@/infrastructure/repositories/countries.repository.mock';
import { CountriesRepository } from '@/infrastructure/repositories/countries.repository';
import { createCountryUseCase } from '@/application/use-cases/create-country.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

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
        .bind(DI_SYMBOLS.ICreateCountryUseCase)
        .toHigherOrderFunction(createCountryUseCase, [
            DI_SYMBOLS.ICountriesRepository,
        ]);
    return countriesModule;
}
