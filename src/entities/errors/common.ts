export class InputParseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
