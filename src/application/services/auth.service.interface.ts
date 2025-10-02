export type OAuthProvider = 'github';

export interface IAuthenticationService {
    signIn(provider: OAuthProvider, redirectUrl?: string): Promise<void>;
    signOut(): Promise<void>;
    validateSession(): Promise<boolean>;
}
