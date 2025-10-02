'use server';
import { AuthenticationService } from '@/infrastructure/services/auth.service';
import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';

export async function login() {
    // TODO use dependency injection here, signInController
    const authService = container.get<AuthenticationService>(
        DI_SYMBOLS.IAuthenticationService,
    );
    await authService.signIn('github');
}

export async function logout() {
    // TODO use dependency injection here, signOutController
    const authService = container.get<AuthenticationService>(
        DI_SYMBOLS.IAuthenticationService,
    );

    await authService.signOut();
}
