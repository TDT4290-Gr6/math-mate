import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export class NextAuthService implements IAuthenticationService {
    async isAuthenticated(): Promise<boolean> {
        const session = await getServerSession(authOptions);
        return !!session;
    }
}
