'use client';

import { LoggerProvider } from './components/logger/LoggerProvider';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

/**
 * Providers
 *
 * Higher-order component that wraps the application with global providers.
 *
 * - `SessionProvider`: Provides authentication session context using NextAuth.
 * - `LoggerProvider`: Provides a context for logging user events and actions.
 *
 * This component should wrap the root of the app so that all children
 * have access to authentication and logging contexts.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The React nodes to be wrapped by the providers.
 * @returns {JSX.Element} The children wrapped with session and logger providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoggerProvider>{children}</LoggerProvider>
        </SessionProvider>
    );
}

export default Providers;
