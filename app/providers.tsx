'use client';

import { LoggerProvider } from './components/logger/LoggerProvider';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoggerProvider>{children}</LoggerProvider>
        </SessionProvider>
    );
}

export default Providers;
