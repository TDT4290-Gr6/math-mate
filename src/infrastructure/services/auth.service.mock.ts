import type { IAuthenticationService } from '@/application/services/auth.service.interface';

export class MockAuthenticationService implements IAuthenticationService {
    private userId: number | null = 1;
    private authenticated: boolean = false;

    constructor(authenticated: boolean = false, userId: number | null = 1) {
        this.authenticated = authenticated;
        this.userId = userId;
    }

    setAuthenticated(authenticated: boolean): void {
        this.authenticated = authenticated;
    }

    async getCurrentUserId(): Promise<number | null> {
        return this.userId;
    }

    async isAuthenticated(): Promise<boolean> {
        return this.authenticated;
    }
}
