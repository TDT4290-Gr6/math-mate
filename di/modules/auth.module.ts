import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { signInController } from '@/interface-adapters/controllers/signIn.controller';
import { NextAuthService } from '@/infrastructure/services/nextAuth.service';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

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
        .toHigherOrderFunction(signInController, [
            DI_SYMBOLS.ICreateUserUseCase,
        ]);

    return authModule;
}
