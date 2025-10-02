export type OAuthProvider = 'google' | 'github';

export interface IAuthenticationService {
    signIn(provider: string, redirectUrl?: string): Promise<void>;
    signOut(): Promise<void>;
    validateSession(): Promise<boolean>;
}
