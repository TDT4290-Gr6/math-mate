import type { IAuthenticationService } from '@/application/services/auth.service.interface';
export class MockAuthenticationService implements IAuthenticationService {
    private isAuthenticated = false;

    async signIn(provider: string, redirectUr?: string): Promise<void> {
        // Simulate sign in
        this.isAuthenticated = true;
        return;
    }

    async signOut(): Promise<void> {
        // Simulate sign out
        this.isAuthenticated = false;
        return;
    }

    async validateSession(): Promise<boolean> {
        // Simulate session validation
        return this.isAuthenticated;
    }
}
