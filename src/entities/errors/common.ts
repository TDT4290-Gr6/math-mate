/**
 * Error thrown when input validation or parsing fails.
 *
 * This is typically used when user input or external data
 * does not conform to the expected format or schema.
 */
export class InputParseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

/**
 * Error thrown when a database operation fails.
 *
 * This can be used to signal issues such as failed inserts,
 * updates, deletes, or connection problems.
 */
export class DatabaseOperationError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
