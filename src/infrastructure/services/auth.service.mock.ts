import type { IAuthenticationService } from '@/application/services/auth.service.interface';

/**
 * Mock implementation of `IAuthenticationService` for testing purposes.
 *
 * Allows simulating authentication state and current user ID without
 * relying on a real authentication system.
 *
 * @remarks
 * - `authenticated` controls whether `isAuthenticated()` returns true or false.
 * - `userId` controls the value returned by `getCurrentUserId()`.
 *
 * @example
 * const authService = new MockAuthenticationService(true, 42);
 * await authService.isAuthenticated(); // true
 * await authService.getCurrentUserId(); // 42
 */
export class MockAuthenticationService implements IAuthenticationService {
    private userId: number | null = 1;
    private authenticated: boolean = false;

    constructor(authenticated: boolean = false, userId: number | null = 1) {
        this.authenticated = authenticated;
        this.userId = userId;
    }

    /**
     * Sets the authentication state for the mock.
     * @param authenticated - Whether the user is authenticated.
     */
    setAuthenticated(authenticated: boolean): void {
        this.authenticated = authenticated;
    }

    /**
     * Sets the current user ID for the mock.
     * @param userId - The ID of the user (or null).
     */
    setCurrentUserId(userId: number | null): void {
        this.userId = userId;
    }

    /**
     * Retrieves the current user ID.
     * @returns The current user ID, or null if no user is set.
     */
    async getCurrentUserId(): Promise<number | null> {
        return this.userId;
    }

    /**
     * Checks if a user is authenticated.
     * @returns True if authenticated, false otherwise.
     */
    async isAuthenticated(): Promise<boolean> {
        return this.authenticated;
    }
}
