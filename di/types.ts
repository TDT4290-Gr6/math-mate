import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
};

export interface Registry {
    // Services
    [DI_SYMBOLS.IAuthenticationService]: IAuthenticationService;

    // Repositories
    [DI_SYMBOLS.ICountriesRepository]: ICountriesRepository;

    // Use Cases
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;

    // Controllers
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
}
