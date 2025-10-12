export type OAuthProvider = 'github';

export interface IAuthenticationService {
    isAuthenticated(): Promise<boolean>;
    getCurrentUserId(): Promise<number | null>;
}
