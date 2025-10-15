import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Service for handling authentication using NextAuth.
 *
 * Implements the `IAuthenticationService` interface to provide methods for retrieving
 * the current authenticated user's ID and checking authentication status.
 *
 * @remarks
 * This service relies on NextAuth's `getServerSession` and `authOptions` to access session data.
 *
 * @example
 * const authService = new NextAuthService();
 * const userId = await authService.getCurrentUserId();
 * const isAuthenticated = await authService.isAuthenticated();
 */
export class NextAuthService implements IAuthenticationService {
    async getCurrentUserId(): Promise<number | null> {
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            const userId = Number(session.user.id);
            return Number.isNaN(userId) ? null : userId;
        }
        return null;
    }

    async isAuthenticated(): Promise<boolean> {
        const session = await getServerSession(authOptions);
        return !!session;
    }
}
