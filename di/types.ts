import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { IGetCountriesController } from '@/interface-adapters/controllers/get-countries.controller';
import type { IGetProblemsController } from '@/interface-adapters/controllers/get-problems.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ISetCountryController } from '@/interface-adapters/controllers/set-country.controller';
import type { IGetProblemController } from '@/interface-adapters/controllers/get-problem.controller';
import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import type { ISendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import type { ISendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import type { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import type { IGetUserController } from '@/interface-adapters/controllers/get-user.controller';
import type { IUsersRepository } from '@/application/repositories/users.repository.interface';
import type { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import type { ISignInController } from '@/interface-adapters/controllers/signIn.controller';
import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import type { IGetCountriesUseCase } from '@/application/use-cases/get-countries.use-case';
import type { IGetProblemsUseCase } from '@/application/use-cases/get-problems.use-case';
import type { ISetCountryUseCase } from '@/application/use-cases/set-country.use-case';
import type { IGetProblemUseCase } from '@/application/use-cases/get-problem.use-case';
import type { ICreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import type { IChatService } from '@/application/services/chat.service.interface';
import type { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import type { ISignInUseCase } from '@/application/use-cases/sign-in.use-case';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),
    IChatService: Symbol.for('IChatService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IUsersRepository: Symbol.for('IUsersRepository'),
    ISolvesRepository: Symbol.for('ISolvesRepository'),
    IProblemsRepository: Symbol.for('IProblemsRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    IGetCountriesUseCase: Symbol.for('IGetCountriesUseCase'),
    ICreateUserUseCase: Symbol.for('ICreateUserUseCase'),
    ISignInUseCase: Symbol.for('ISignInUseCase'),
    ISetCountryUseCase: Symbol.for('ISetCountryUseCase'),
    IGetProblemUseCase: Symbol.for('IGetProblemUseCase'),
    IGetProblemsUseCase: Symbol.for('IGetProblemsUseCase'),
    ISendChatMessageUseCase: Symbol.for('ISendChatMessageUseCase'),
    IGetUserUseCase: Symbol.for('IGetUserUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    IGetCountriesController: Symbol.for('IGetCountriesController'),
    ISignInController: Symbol.for('ISignInController'),
    ISetCountryController: Symbol.for('ISetCountryController'),
    IGetProblemController: Symbol.for('IGetProblemController'),
    IGetProblemsController: Symbol.for('IGetProblemsController'),
    ISendChatMessageController: Symbol.for('ISendChatMessageController'),
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
    IProblemsRepository: IProblemsRepository;

    // Use Cases
    ICreateCountryUseCase: ICreateCountryUseCase;
    IGetCountriesUseCase: IGetCountriesUseCase;
    ICreateUserUseCase: ICreateUserUseCase;
    ISignInUseCase: ISignInUseCase;
    ISetCountryUseCase: ISetCountryUseCase;
    IGetProblemUseCase: IGetProblemUseCase;
    IGetProblemsUseCase: IGetProblemsUseCase;
    ISendChatMessageUseCase: ISendChatMessageUseCase;
    IGetUserUseCase: IGetUserUseCase;

    // Controllers
    ICreateCountryController: ICreateCountryController;
    IGetCountriesController: IGetCountriesController;
    ISignInController: ISignInController;
    ISetCountryController: ISetCountryController;
    IGetProblemController: IGetProblemController;
    IGetProblemsController: IGetProblemsController;
    ISendChatMessageController: ISendChatMessageController;
    IGetUserController: IGetUserController;
}
