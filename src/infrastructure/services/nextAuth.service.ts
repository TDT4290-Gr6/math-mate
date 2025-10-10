import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

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
