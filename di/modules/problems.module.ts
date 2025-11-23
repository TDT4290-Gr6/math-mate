import { getProblemsController } from '@/interface-adapters/controllers/get-problems.controller';
import { MockProblemsRepository } from '@/infrastructure/repositories/problems.repository.mock';
import { getProblemController } from '@/interface-adapters/controllers/get-problem.controller';
import { ProblemsRepository } from '@/infrastructure/repositories/problems.repository';
import { getProblemsUseCase } from '@/application/use-cases/get-problems.use-case';
import { getProblemUseCase } from '@/application/use-cases/get-problem.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

/**
 * problemsModule
 *
 * Configures and returns the dependency injection module for problem-related operations.
 *
 * - Binds `IProblemsRepository` to a mock implementation (`MockProblemsRepository`) when testing,
 *   or to the real `ProblemsRepository` in production.
 * - Binds use cases:
 *   - `IGetProblemsUseCase` → `getProblemsUseCase` (injects `IProblemsRepository`)
 *   - `IGetProblemUseCase` → `getProblemUseCase` (injects `IProblemsRepository`)
 * - Binds controllers:
 *   - `IGetProblemsController` → `getProblemsController` (injects `IGetProblemsUseCase`,
 *     `IGetUserUseCase`, `IAuthenticationService`)
 *   - `IGetProblemController` → `getProblemController` (injects `IGetProblemUseCase`,
 *     `IAuthenticationService`)
 *
 * This module centralizes all dependencies for fetching and managing problems,
 * enabling consistent access to problem data and user-specific problem operations.
 *
 * @returns {Module} The configured DI module for problem-related services.
 */
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

    problemsModule
        .bind(DI_SYMBOLS.IGetProblemUseCase)
        .toHigherOrderFunction(getProblemUseCase, [
            DI_SYMBOLS.IProblemsRepository,
        ]);

    // Controller binding
    problemsModule
        .bind(DI_SYMBOLS.IGetProblemsController)
        .toHigherOrderFunction(getProblemsController, [
            DI_SYMBOLS.IGetProblemsUseCase,
            DI_SYMBOLS.IGetUserUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    problemsModule
        .bind(DI_SYMBOLS.IGetProblemController)
        .toHigherOrderFunction(getProblemController, [
            DI_SYMBOLS.IGetProblemUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    return problemsModule;
}
