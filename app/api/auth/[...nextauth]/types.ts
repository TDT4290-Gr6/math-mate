import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        };
    }

    interface Token {
        userId?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
    }
}
