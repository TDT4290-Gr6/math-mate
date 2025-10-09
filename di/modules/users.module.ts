import { MockUsersRepository } from '@/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/infrastructure/repositories/users.repository';
import { createUserUseCase } from '@/application/use-cases/create-user.use-case';
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
        .bind(DI_SYMBOLS.ICreateUserUseCase)
        .toHigherOrderFunction(createUserUseCase, [
            DI_SYMBOLS.IUsersRepository,
        ]);

    return usersModule;
}
