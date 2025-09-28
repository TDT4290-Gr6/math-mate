import { ICreateCountryController } from '@/src/interface-adapters/controllers/create-country.controller';
import { ICountriesRepository } from '@/src/application/repositories/countries.repository.interface';
import { ICreateCountryUseCase } from '@/src/application/use-cases/create-country.use-case';
import { IAuthenticationService } from '@/src/application/services/auth.service.interface';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Repositories
    ICountryRepository: Symbol.for('ICountryRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
};

export interface Registry {
    // Services
    [DI_SYMBOLS.IAuthenticationService]: IAuthenticationService;

    // Repositories
    [DI_SYMBOLS.ICountryRepository]: ICountriesRepository;

    // Use Cases
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;

    // Controllers
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
}
