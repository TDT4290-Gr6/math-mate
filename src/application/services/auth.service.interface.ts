/**
 * Supported OAuth providers for authentication.
 */
export type OAuthProvider = 'github';

/**
 * Interface for an authentication service.
 * Provides methods to check authentication status and retrieve the current user's ID.
 */
export interface IAuthenticationService {
    /**
     * Checks whether a user is currently authenticated.
     *
     * @returns A promise that resolves to `true` if the user is authenticated, otherwise `false`.
     */
    isAuthenticated(): Promise<boolean>;

    /**
     * Retrieves the ID of the currently authenticated user.
     *
     * @returns A promise that resolves to the user ID if authenticated, or `null` if not authenticated.
     */
    getCurrentUserId(): Promise<number | null>;
}
