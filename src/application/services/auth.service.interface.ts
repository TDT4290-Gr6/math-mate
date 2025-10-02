import { User } from '@/entities/models/user';

export type OAuthProvider = 'google' | 'github';

export interface IAuthenticationService {
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    validateSession(): Promise<boolean>;
}
