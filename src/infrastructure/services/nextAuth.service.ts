import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export class NextAuthService implements IAuthenticationService {
    async getCurrentUserId(): Promise<string | null> {
        const session = await getServerSession(authOptions);
        if (session && session.user) {
            const userId = session.user.id as string;
            return userId;
        }
        return null;
    }

    async isAuthenticated(): Promise<boolean> {
        const session = await getServerSession(authOptions);
        return !!session;
    }
}
