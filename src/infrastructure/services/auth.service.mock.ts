import type { IAuthenticationService } from '@/application/services/auth.service.interface';
export class MockAuthenticationService implements IAuthenticationService {
    async isAuthenticated(): Promise<boolean> {
        // Simulate session validation
        return true;
    }
}
