import { ISignInController } from '@/interface-adapters/controllers/signIn.controller';
import GithubProvider from 'next-auth/providers/github';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environment variables');
}

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: '/auth/signIn', // custom sign-in page
    },
    callbacks: {
        async signIn({ user }) {
            const signInController = container.get<ISignInController>(
                DI_SYMBOLS.ISignInController,
            );

            try {
                await signInController({
                    uuid: user.id + '',
                });
            } catch (error) {
                console.error('[nextauth] signIn error', error);
                return false;
            }
            return true;
        },
    },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
