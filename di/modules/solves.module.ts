import { addSolvedProblemController } from '@/interface-adapters/controllers/add-solved-problem.controller';
import { addSolvedProblemUseCase } from '@/application/use-cases/add-solved-problem.use-case';
import { MockSolvesRepository } from '@/infrastructure/repositories/solves.repository.mock';
import { getLatestSolvesUseCase } from '@/application/use-cases/get-latest-solves.use-case';
import { SolvesRepository } from '@/infrastructure/repositories/solves.repository';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function solvesModule() {
    const solvesModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        solvesModule
            .bind(DI_SYMBOLS.ISolvesRepository)
            .toClass(MockSolvesRepository);
    } else {
        solvesModule
            .bind(DI_SYMBOLS.ISolvesRepository)
            .toClass(SolvesRepository);
    }

    solvesModule
        .bind(DI_SYMBOLS.IAddSolvedProblemController)
        .toHigherOrderFunction(addSolvedProblemController, [
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.IAddSolvedProblemUseCase,
        ]);

    solvesModule
        .bind(DI_SYMBOLS.IAddSolvedProblemUseCase)
        .toHigherOrderFunction(addSolvedProblemUseCase, [
            DI_SYMBOLS.IUsersRepository,
            DI_SYMBOLS.ISolvesRepository,
        ]);

    solvesModule
        .bind(DI_SYMBOLS.IGetLatestSolvesUseCase)
        .toHigherOrderFunction(getLatestSolvesUseCase, [
            DI_SYMBOLS.IUsersRepository,
            DI_SYMBOLS.ISolvesRepository,
        ]);

    return solvesModule;
}
