import type { IAuthenticationService } from '@/application/services/auth.service.interface';
export class MockAuthenticationService implements IAuthenticationService {
    async getCurrentUserId(): Promise<string | null> {
        return 'mock-user-id';
    }
    async isAuthenticated(): Promise<boolean> {
        // Simulate session validation
        return true;
    }
}
