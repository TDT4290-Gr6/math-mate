import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import type { LogEventUseCase as ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import type { ICreateEventController} from '@/interface-adapters/controllers/create-event.controller';
 
 
 
export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),
 
    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IEventsRepository: Symbol.for('IEventsRepository'),
 
    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    ILogEventUseCase: Symbol.for('ILogEventUseCase'),
 
    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    ICreateEventController: Symbol.for('ICreateEventController'),
};
 
export interface Registry {
    // Services
    [DI_SYMBOLS.IAuthenticationService]: IAuthenticationService;
 
    // Repositories
    [DI_SYMBOLS.ICountriesRepository]: ICountriesRepository;
    [DI_SYMBOLS.IEventsRepository]: IEventsRepository;
 
    // Use Cases
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;
    [DI_SYMBOLS.ILogEventUseCase]: ILogEventUseCase;
 
    // Controllers
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
    [DI_SYMBOLS.ICreateEventController]: ICreateEventController;
}
 
 