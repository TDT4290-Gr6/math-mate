import { getProblemsController } from '@/interface-adapters/controllers/get-problems.controller';
import { MockProblemsRepository } from '@/infrastructure/repositories/problems.repository.mock';
import { ProblemsRepository } from '@/infrastructure/repositories/problems.repository';
import { getProblemsUseCase } from '@/application/use-cases/get-problems.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function problemsModule() {
    const problemsModule = createModule();

    // Repository binding
    if (process.env.NODE_ENV === 'test') {
        problemsModule
            .bind(DI_SYMBOLS.IProblemsRepository)
            .toClass(MockProblemsRepository);
    } else {
        problemsModule
            .bind(DI_SYMBOLS.IProblemsRepository)
            .toClass(ProblemsRepository);
    }

    // Use Case binding
    problemsModule
        .bind(DI_SYMBOLS.IGetProblemsUseCase)
        .toHigherOrderFunction(getProblemsUseCase, [
            DI_SYMBOLS.IProblemsRepository,
        ]);

    // Controller binding
    problemsModule
        .bind(DI_SYMBOLS.IGetProblemsController)
        .toHigherOrderFunction(getProblemsController, [
            DI_SYMBOLS.IGetProblemsUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    return problemsModule;
}
