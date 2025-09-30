export interface IAuthenticationService {
    validateSession(sessionId: string): Promise<boolean>;
    createSession(userId: string): Promise<string>;
    invalidateSession(sessionId: string): Promise<boolean>;
}
