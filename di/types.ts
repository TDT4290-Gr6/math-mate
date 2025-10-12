import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { IGetCountriesController } from '@/interface-adapters/controllers/get-countries.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ISetCountryController } from '@/interface-adapters/controllers/set-country.controller';
import type { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import type { IGetUserController } from '@/interface-adapters/controllers/get-user.controller';
import type { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { ISendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import { ISendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { ISignInController } from '@/interface-adapters/controllers/signIn.controller';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import type { IGetCountriesUseCase } from '@/application/use-cases/get-countries.use-case';
import type { ISetCountryUseCase } from '@/application/use-cases/set-country.use-case';
import type { ICreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import type { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import type { ISignInUseCase } from '@/application/use-cases/sign-in.use-case';
import { IChatService } from '@/application/services/chat.service.interface';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IUsersRepository: Symbol.for('IUsersRepository'),
    ISolvesRepository: Symbol.for('ISolvesRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    IGetCountriesUseCase: Symbol.for('IGetCountriesUseCase'),
    ICreateUserUseCase: Symbol.for('ICreateUserUseCase'),
    ISignInUseCase: Symbol.for('ISignInUseCase'),
    ISetCountryUseCase: Symbol.for('ISetCountryUseCase'),
    ISendChatMessageUseCase: Symbol.for('ISendChatMessageUseCase'),
    IGetUserUseCase: Symbol.for('IGetUserUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    IGetCountriesController: Symbol.for('IGetCountriesController'),
    ISignInController: Symbol.for('ISignInController'),
    ISetCountryController: Symbol.for('ISetCountryController'),
    ISendChatMessageController: Symbol.for('ISendChatMessageController'),

    // Services
    IChatService: Symbol.for('IChatService'),
    IGetUserController: Symbol.for('IGetUserController'),
};

export interface DI_RETURN_TYPES {
    // Services
    IAuthenticationService: IAuthenticationService;
    IChatService: IChatService;

    // Repositories
    ICountriesRepository: ICountriesRepository;
    IUsersRepository: IUsersRepository;
    ISolvesRepository: ISolvesRepository;

    // Use Cases
    ICreateCountryUseCase: ICreateCountryUseCase;
    IGetCountriesUseCase: IGetCountriesUseCase;
    ICreateUserUseCase: ICreateUserUseCase;
    ISignInUseCase: ISignInUseCase;
    ISetCountryUseCase: ISetCountryUseCase;
    ISendChatMessageUseCase: ISendChatMessageUseCase;
    IGetUserUseCase: IGetUserUseCase;

    // Controllers
    ICreateCountryController: ICreateCountryController;
    IGetCountriesController: IGetCountriesController;
    ISignInController: ISignInController;
    ISetCountryController: ISetCountryController;
    ISendChatMessageController: ISendChatMessageController;
    IGetUserController: IGetUserController;
}
