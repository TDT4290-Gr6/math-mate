import { setCountryController } from '@/interface-adapters/controllers/set-country.controller';
import { MockUsersRepository } from '@/infrastructure/repositories/users.repository.mock';
import { getUserController } from '@/interface-adapters/controllers/get-user.controller';
import { UsersRepository } from '@/infrastructure/repositories/users.repository';
import { setCountryUseCase } from '@/application/use-cases/set-country.use-case';
import { createUserUseCase } from '@/application/use-cases/create-user.use-case';
import { getUserUseCase } from '@/application/use-cases/get-user.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function usersModule() {
    const usersModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        usersModule
            .bind(DI_SYMBOLS.IUsersRepository)
            .toClass(MockUsersRepository);
    } else {
        usersModule.bind(DI_SYMBOLS.IUsersRepository).toClass(UsersRepository);
    }

    usersModule
        .bind(DI_SYMBOLS.ISetCountryController)
        .toHigherOrderFunction(setCountryController, [
            DI_SYMBOLS.ISetCountryUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    usersModule
        .bind(DI_SYMBOLS.IGetUserController)
        .toHigherOrderFunction(getUserController, [
            DI_SYMBOLS.IGetUserUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    usersModule
        .bind(DI_SYMBOLS.ICreateUserUseCase)
        .toHigherOrderFunction(createUserUseCase, [
            DI_SYMBOLS.IUsersRepository,
        ]);

    usersModule
        .bind(DI_SYMBOLS.ISetCountryUseCase)
        .toHigherOrderFunction(setCountryUseCase, [
            DI_SYMBOLS.IUsersRepository,
            DI_SYMBOLS.ICountriesRepository,
        ]);

    usersModule
        .bind(DI_SYMBOLS.IGetUserUseCase)
        .toHigherOrderFunction(getUserUseCase, [DI_SYMBOLS.IUsersRepository]);

    return usersModule;
}
