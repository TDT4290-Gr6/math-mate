import CredentialsProvider from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers/index';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { getInjection } from '@/di/container';
import { NextAuthOptions } from 'next-auth';

if (!process.env.NEXT_AUTH_GITHUB_ID || !process.env.NEXT_AUTH_GITHUB_SECRET) {
    throw new Error(
        'Missing NEXT_AUTH_GITHUB_ID or NEXT_AUTH_GITHUB_SECRET environment variables',
    );
}

if (!process.env.NEXT_AUTH_GOOGLE_ID || !process.env.NEXT_AUTH_GOOGLE_SECRET) {
    throw new Error(
        'Missing NEXT_AUTH_GOOGLE_ID or NEXT_AUTH_GOOGLE_SECRET environment variables',
    );
}

const providers: Provider[] = [
    GithubProvider({
        clientId: process.env.NEXT_AUTH_GITHUB_ID!,
        clientSecret: process.env.NEXT_AUTH_GITHUB_SECRET!,
    }),
    GoogleProvider({
        clientId: process.env.NEXT_AUTH_GOOGLE_ID!,
        clientSecret: process.env.NEXT_AUTH_GOOGLE_SECRET!,
    }),
];

// Make sure CYPRESS_TESTING is NOT 'true' in production
if (process.env.CYPRESS_TESTING === 'true') {
    providers.push(
        CredentialsProvider({
            id: 'cypress',
            name: 'Cypress',
            credentials: {
                id: { label: 'ID', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // Validate id/uuid starts with 'cypress'
                if (!credentials.id?.startsWith('cypress')) {
                    throw new Error(
                        "Credentials id/uuid must start with 'cypress'. Got: " +
                            credentials.id,
                    );
                }

                return { id: credentials.id };
            },
        }),
    );
}

/**
 * NextAuth.js configuration options for authentication.
 *
 * @remarks
 * - Configures GitHub and Google as an authentication provider using environment variables for credentials.
 * - Specifies a custom sign-in page at `/auth/signIn`.
 * - Implements custom callback functions for sign-in, session, and JWT handling:
 *   - `signIn`: Invokes a dependency-injected sign-in controller, updates the user ID, and handles errors.
 *   - `session`: Ensures the session contains the correct user ID from the JWT token.
 *   - `jwt`: Persists the user ID to the JWT token on initial sign-in.
 *
 * @see {@link https://next-auth.js.org/configuration/options}
 */
export const authOptions: NextAuthOptions = {
    providers,
    pages: {
        signIn: '/auth/signIn', // custom sign-in page
    },
    callbacks: {
        async signIn({ user }) {
            const signInController = getInjection('ISignInController');

            try {
                const { userId } = await signInController({
                    uuid: user.id + '',
                });
                user.id = '' + userId;
            } catch (error) {
                console.error('[nextauth] signIn error', error);
                return false;
            }
            return true;
        },
        async session({ session, token }) {
            // if we stored a userId on the token during signIn, copy it into the session
            if (token?.userId && session.user) {
                session.user = { id: token.userId };
            }

            return session;
        },
        async jwt({ token, user }) {
            // when the user object exists (on initial sign in), persist their id to the token
            if (user?.id) token.userId = user.id;
            return token;
        },
    },
};
