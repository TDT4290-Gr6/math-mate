import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { getSession, signIn, signOut } from 'next-auth/react';

export class NextAuthService implements IAuthenticationService {
    async signIn(): Promise<void> {
        await signIn('github');
    }

    async signOut(): Promise<void> {
        await signOut();
    }

    async getSession() {
        return await getSession(); // returns session or null
    }

    async validateSession(): Promise<boolean> {
        const session = await this.getSession();
        return !!session;
    }
}
