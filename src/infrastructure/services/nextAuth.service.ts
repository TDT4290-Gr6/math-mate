import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { getServerSession } from 'next-auth';

export class NextAuthService implements IAuthenticationService {
    async isAuthenticated(): Promise<boolean> {
        const session = await getServerSession();
        return !!session;
    }
}
