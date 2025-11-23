import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { signInController } from '@/interface-adapters/controllers/signIn.controller';
import { NextAuthService } from '@/infrastructure/services/nextAuth.service';
import { signInUseCase } from '@/application/use-cases/sign-in.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

/**
 * authModule
 *
 * Configures and returns the dependency injection module for authentication-related services.
 *
 * - Binds `IAuthenticationService` to a mock implementation during testing (`MockAuthenticationService`)
 *   or to the production NextAuth implementation (`NextAuthService`) otherwise.
 * - Binds `ISignInController` to the `signInController` function, injecting `ISignInUseCase`.
 * - Binds `ISignInUseCase` to the `signInUseCase` function, injecting `IUsersRepository`.
 *
 * This module centralizes all authentication dependencies for easy DI management.
 *
 * @returns {Module} The configured DI module for authentication.
 */
export function authModule() {
    const authModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(MockAuthenticationService);
    } else {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(NextAuthService);
    }

    authModule
        .bind(DI_SYMBOLS.ISignInController)
        .toHigherOrderFunction(signInController, [DI_SYMBOLS.ISignInUseCase]);

    authModule
        .bind(DI_SYMBOLS.ISignInUseCase)
        .toHigherOrderFunction(signInUseCase, [DI_SYMBOLS.IUsersRepository]);

    return authModule;
}
