import { User } from '@/entities/models/user';

export type OAuthProvider = 'google' | 'github';

export interface IAuthenticationService {
    signIn(provider: OAuthProvider, redirectTo?: string): Promise<void>;
    signOut(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
}
