import { MockUsersRepository } from '@/infrastructure/repositories/users.repositroy.mock';
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
        throw new Error('No real users repository implemented yet.');
    }

    usersModule
        .bind(DI_SYMBOLS.ICreateUserUseCase)
        .toHigherOrderFunction(createUserUseCase, [
            DI_SYMBOLS.IUsersRepository,
        ]);
}
