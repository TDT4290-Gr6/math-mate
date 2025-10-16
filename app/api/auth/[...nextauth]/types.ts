/**
 * Extends the NextAuth.js Session and JWT interfaces to include custom user properties.
 *
 * - Adds a required `id` property to the `user` object in the `Session` interface.
 * - Adds an optional `userId` property to the `JWT` interface.
 *
 * This allows for strongly-typed access to the user's unique identifier throughout the authentication flow.
 */
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
    }
}
