import {
    IAuthenticationService,
    type OAuthProvider,
} from '@/application/services/auth.service.interface';
import { AuthenticationError } from '@/entities/errors/auth';
import { createClient } from '@/lib/supabase/server';
import { User } from '@/entities/models/user';
import { redirect } from 'next/navigation';

export class AuthenticationService implements IAuthenticationService {
    async signIn(provider: OAuthProvider): Promise<void> {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `http://localhost:3000/auth/callback`,
            },
        });

        if (error) {
            console.error('OAuth error:', error.message);
            throw error;
        }

        if (data.url) {
            redirect(data.url);
        }
    }
    async signOut(): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log('Error during sign out:', error.message);
            throw new AuthenticationError(error.message);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('User signed out successfully');
        }
    }
    async getCurrentUser(): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
}
