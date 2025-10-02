import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environment variables');
}
const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // TODO upcoming issues
            return true;
        },
        async redirect({ url, baseUrl }) {
            // TODO upcoming issues
            return baseUrl;
        },
        async session({ session, user, token }) {
            // TODO upcoming issues
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            // TODO upcoming issues
            return token;
        },
    },
});

export { handler as GET, handler as POST };
