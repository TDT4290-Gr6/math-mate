"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { LoggerProvider } from './components/logger/LoggerProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoggerProvider>{children}</LoggerProvider>
        </SessionProvider>
    );
}

export default Providers;
