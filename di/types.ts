import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { ISignInController } from '@/interface-adapters/controllers/signIn.controller';
import { ICreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { ISignInUseCase } from '@/application/use-cases/sign-in.use-case';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IUsersRepository: Symbol.for('IUsersRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    ICreateUserUseCase: Symbol.for('ICreateUserUseCase'),
    ISignInUseCase: Symbol.for('ISignInUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    ISignInController: Symbol.for('ISignInController'),
};

export interface Registry {
    // Services
    [DI_SYMBOLS.IAuthenticationService]: IAuthenticationService;

    // Repositories
    [DI_SYMBOLS.ICountriesRepository]: ICountriesRepository;
    [DI_SYMBOLS.IUsersRepository]: IUsersRepository;

    // Use Cases
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;
    [DI_SYMBOLS.ICreateUserUseCase]: ICreateUserUseCase;
    [DI_SYMBOLS.ISignInUseCase]: ISignInUseCase;

    // Controllers
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
    [DI_SYMBOLS.ISignInController]: ISignInController;
}
