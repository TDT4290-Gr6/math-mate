import { User } from '@/entities/models/user';

export type OAuthProvider = 'google' | 'github';

export interface IAuthenticationService {
    signIn(provider: string, redirectUr?: string): Promise<void>;
    signOut(): Promise<void>;
    validateSession(): Promise<boolean>;
}
