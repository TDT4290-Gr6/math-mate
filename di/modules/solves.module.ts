import { addSolvedProblemController } from '@/interface-adapters/controllers/add-solved-problem.controller';
import { getLatestSolvesController } from '@/interface-adapters/controllers/get-latest-solves.controller';
import { addSolvedProblemUseCase } from '@/application/use-cases/add-solved-problem.use-case';
import { MockSolvesRepository } from '@/infrastructure/repositories/solves.repository.mock';
import { getLatestSolvesUseCase } from '@/application/use-cases/get-latest-solves.use-case';
import { SolvesRepository } from '@/infrastructure/repositories/solves.repository';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

/**
 * solvesModule
 *
 * Configures and returns the dependency injection module for managing problem solves.
 *
 * - Binds `ISolvesRepository` to a mock implementation (`MockSolvesRepository`) in test environments,
 *   or to the real `SolvesRepository` in production.
 * - Binds use cases:
 *   - `IAddSolvedProblemUseCase` → `addSolvedProblemUseCase` (injects `IUsersRepository` and `ISolvesRepository`)
 *   - `IGetLatestSolvesUseCase` → `getLatestSolvesUseCase` (injects `IUsersRepository` and `ISolvesRepository`)
 * - Binds controllers:
 *   - `IAddSolvedProblemController` → `addSolvedProblemController` (injects `IAuthenticationService` and `IAddSolvedProblemUseCase`)
 *   - `IGetLatestSolvesController` → `getLatestSolvesController` (injects `IAuthenticationService` and `IGetLatestSolvesUseCase`)
 *
 * This module centralizes all dependencies for recording solves, retrieving latest solves,
 * and associating them with authenticated users.
 *
 * @returns {Module} The configured DI module for solves-related services.
 */
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

    solvesModule
        .bind(DI_SYMBOLS.IGetLatestSolvesController)
        .toHigherOrderFunction(getLatestSolvesController, [
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.IGetLatestSolvesUseCase,
        ]);

    return solvesModule;
}
