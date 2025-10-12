import GithubProvider from 'next-auth/providers/github';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { getInjection } from '@/di/container';

if (!process.env.NEXT_AUTH_GITHUB_ID || !process.env.NEXT_AUTH_GITHUB_SECRET) {
    throw new Error(
        'Missing NEXT_AUTH_GITHUB_ID or NEXT_AUTH_GITHUB_SECRET environment variables',
    );
}

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.NEXT_AUTH_GITHUB_ID,
            clientSecret: process.env.NEXT_AUTH_GITHUB_SECRET,
        }),
        // ...add more providers here
    ],
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
            console.log('session callback', { session });

            return session;
        },
        async jwt({ token, user }) {
            // when the user object exists (on initial sign in), persist their id to the token
            if (user?.id) token.userId = user.id;
            return token;
        },
    },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
