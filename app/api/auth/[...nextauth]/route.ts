/**
 * NextAuth API route handler for authentication.
 *
 * This handler uses the `authOptions` configuration from the local auth library
 * and sets up NextAuth for both GET and POST HTTP methods.
 *
 * @see https://next-auth.js.org/getting-started/introduction
 * @module api/auth/[...nextauth]/route
 */
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
