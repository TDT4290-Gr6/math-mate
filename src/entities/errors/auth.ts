/**
 * Error thrown when there is a general authentication failure.
 *
 * This can be used for cases where authentication cannot be completed,
 * such as invalid credentials or token issues.
 */
export class AuthenticationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

/**
 * Error thrown when a user is not authenticated.
 *
 * Typically used when an operation requires an authenticated user,
 * but no valid user session or token is present.
 */
export class UnauthenticatedError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

/**
 * Error thrown when an authenticated user does not have permission
 * to perform a specific action.
 *
 * Typically used for authorization checks where the user exists
 * but lacks required privileges.
 */
export class UnauthorizedError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
