import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { ICreateEventController } from '@/interface-adapters/controllers/create-event.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { ISignInController } from '@/interface-adapters/controllers/signIn.controller';
import type { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import { ICreateUserUseCase } from '@/application/use-cases/create-user.use-case';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IEventsRepository: Symbol.for('IEventsRepository'),
    IUsersRepository: Symbol.for('IUsersRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    ILogEventUseCase: Symbol.for('ILogEventUseCase'),
    ICreateUserUseCase: Symbol.for('ICreateUserUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    ICreateEventController: Symbol.for('ICreateEventController'),
    ISignInController: Symbol.for('ISignInController'),
};

export interface Registry {
    // Services
    [DI_SYMBOLS.IAuthenticationService]: IAuthenticationService;

    // Repositories
    [DI_SYMBOLS.ICountriesRepository]: ICountriesRepository;
    [DI_SYMBOLS.IEventsRepository]: IEventsRepository;
    [DI_SYMBOLS.IUsersRepository]: IUsersRepository;

    // Use Cases
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;
    [DI_SYMBOLS.ILogEventUseCase]: ILogEventUseCase;
    [DI_SYMBOLS.ICreateUserUseCase]: ICreateUserUseCase;

    // Controllers
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
    [DI_SYMBOLS.ICreateEventController]: ICreateEventController;
    [DI_SYMBOLS.ISignInController]: ISignInController;
}
