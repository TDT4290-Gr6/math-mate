/**
 * Dependency Injection Symbols and Return Types
 *
 * This file defines all the symbols used for dependency injection (DI) in the application,
 * along with their corresponding TypeScript return types.
 *
 * DI_SYMBOLS:
 * - A mapping from logical dependency names to unique `Symbol` values.
 * - Used to register and retrieve dependencies in the DI container.
 * - Categories include Services, Repositories, Use Cases, and Controllers.
 *
 * DI_RETURN_TYPES:
 * - TypeScript interface that maps each DI symbol to its concrete type.
 * - Ensures type safety when retrieving dependencies from the DI container.
 *
 * Example usage:
 * ```ts
 * const authService: DI_RETURN_TYPES['IAuthenticationService'] = getInjection('IAuthenticationService');
 * ```
 */

import type { IAddSolvedProblemController } from '@/interface-adapters/controllers/add-solved-problem.controller';
import type { IGetLatestSolvesController } from '@/interface-adapters/controllers/get-latest-solves.controller';
import type { ICreateCountryController } from '@/interface-adapters/controllers/create-country.controller';
import type { IGetCountriesController } from '@/interface-adapters/controllers/get-countries.controller';
import type { IGetProblemsController } from '@/interface-adapters/controllers/get-problems.controller';
import type { ICreateEventController } from '@/interface-adapters/controllers/create-event.controller';
import type { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import type { ISetCountryController } from '@/interface-adapters/controllers/set-country.controller';
import type { IGetProblemController } from '@/interface-adapters/controllers/get-problem.controller';
import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import type { IAddSolvedProblemUseCase } from '@/application/use-cases/add-solved-problem.use-case';
import type { ISendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import type { ISendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import type { IGetLatestSolvesUseCase } from '@/application/use-cases/get-latest-solves.use-case';
import type { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
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
import type { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import type { IChatService } from '@/application/services/chat.service.interface';
import type { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import type { ISignInUseCase } from '@/application/use-cases/sign-in.use-case';

export const DI_SYMBOLS = {
    // Services
    IAuthenticationService: Symbol.for('IAuthenticationService'),
    IChatService: Symbol.for('IChatService'),

    // Repositories
    ICountriesRepository: Symbol.for('ICountriesRepository'),
    IEventsRepository: Symbol.for('IEventsRepository'),
    IUsersRepository: Symbol.for('IUsersRepository'),
    ISolvesRepository: Symbol.for('ISolvesRepository'),
    IProblemsRepository: Symbol.for('IProblemsRepository'),

    // Use Cases
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    IGetCountriesUseCase: Symbol.for('IGetCountriesUseCase'),
    ILogEventUseCase: Symbol.for('ILogEventUseCase'),
    ICreateUserUseCase: Symbol.for('ICreateUserUseCase'),
    ISignInUseCase: Symbol.for('ISignInUseCase'),
    ISetCountryUseCase: Symbol.for('ISetCountryUseCase'),
    IGetProblemUseCase: Symbol.for('IGetProblemUseCase'),
    IGetProblemsUseCase: Symbol.for('IGetProblemsUseCase'),
    ISendChatMessageUseCase: Symbol.for('ISendChatMessageUseCase'),
    IGetUserUseCase: Symbol.for('IGetUserUseCase'),
    IAddSolvedProblemUseCase: Symbol.for('IAddSolvedProblemUseCase'),
    IGetLatestSolvesUseCase: Symbol.for('IGetLatestSolvesUseCase'),

    // Controllers
    ICreateCountryController: Symbol.for('ICreateCountryController'),
    IGetCountriesController: Symbol.for('IGetCountriesController'),
    ICreateEventController: Symbol.for('ICreateEventController'),
    ISignInController: Symbol.for('ISignInController'),
    ISetCountryController: Symbol.for('ISetCountryController'),
    IGetProblemController: Symbol.for('IGetProblemController'),
    IGetProblemsController: Symbol.for('IGetProblemsController'),
    ISendChatMessageController: Symbol.for('ISendChatMessageController'),
    IGetUserController: Symbol.for('IGetUserController'),
    IAddSolvedProblemController: Symbol.for('IAddSolvedProblemController'),
    IGetLatestSolvesController: Symbol.for('IGetLatestSolvesController'),
};

export interface DI_RETURN_TYPES {
    // Services
    IAuthenticationService: IAuthenticationService;
    IChatService: IChatService;

    // Repositories
    ICountriesRepository: ICountriesRepository;
    IEventsRepository: IEventsRepository;
    IUsersRepository: IUsersRepository;
    ISolvesRepository: ISolvesRepository;
    IProblemsRepository: IProblemsRepository;

    // Use Cases
    ICreateCountryUseCase: ICreateCountryUseCase;
    ILogEventUseCase: ILogEventUseCase;
    IGetCountriesUseCase: IGetCountriesUseCase;
    ICreateUserUseCase: ICreateUserUseCase;
    ISignInUseCase: ISignInUseCase;
    ISetCountryUseCase: ISetCountryUseCase;
    IGetProblemUseCase: IGetProblemUseCase;
    IGetProblemsUseCase: IGetProblemsUseCase;
    ISendChatMessageUseCase: ISendChatMessageUseCase;
    IGetUserUseCase: IGetUserUseCase;
    IAddSolvedProblemUseCase: IAddSolvedProblemUseCase;
    IGetLatestSolvesUseCase: IGetLatestSolvesUseCase;

    // Controllers
    ICreateCountryController: ICreateCountryController;
    ICreateEventController: ICreateEventController;
    IGetCountriesController: IGetCountriesController;
    ISignInController: ISignInController;
    ISetCountryController: ISetCountryController;
    IGetProblemController: IGetProblemController;
    IGetProblemsController: IGetProblemsController;
    ISendChatMessageController: ISendChatMessageController;
    IGetUserController: IGetUserController;
    IAddSolvedProblemController: IAddSolvedProblemController;
    IGetLatestSolvesController: IGetLatestSolvesController;
}
