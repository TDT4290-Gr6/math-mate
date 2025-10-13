'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

type LogPayload = Record<string, unknown>;

export type LogEventInput = {
    userId: number;
    sessionId: number;
    actionName: string;
    problemId?: number;
    methodId?: number;
    stepId?: number;
    payload?: string | LogPayload;
};

type LoggerContextValue = {
    logEvent: (
        input: Partial<LogEventInput> & { actionName: string },
    ) => Promise<void>;
    sessionId: string;
};

const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

function makeSessionId() {
    // numeric session id so it can be stored as BigInt if needed
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function LoggerProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Generate a sessionId once per provider instance
    const sessionIdRef = useRef<string>(makeSessionId());
    const sessionId = sessionIdRef.current;

    const { data: session } = useSession();

    const logEvent = useCallback(
        async (input: Partial<LogEventInput> & { actionName: string }) => {
            const body = {
                userId: 14,
                sessionId: 24234324,
                actionName: input.actionName,
                loggedAt: new Date().toISOString(),
                problemId: input.problemId,
                methodId: input.methodId,
                stepId: input.stepId,
                payload:
                    typeof input.payload === 'string'
                        ? input.payload
                        : JSON.stringify(input.payload ?? {}),
            };

            try {
                await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
            } catch (err) {
                console.warn('logEvent failed', err);
            }
        },
        [],
    );

    const lastPathRef = useRef<string | null>(null);
    useEffect(() => {
        if (!pathname) return;
        if (lastPathRef.current === pathname) return;
        lastPathRef.current = pathname;
        void logEvent({ actionName: 'page_view', payload: { path: pathname } });
    }, [pathname, logEvent]);

    return (
        <LoggerContext.Provider value={{ logEvent, sessionId }}>
            {children}
        </LoggerContext.Provider>
    );
}

export function useLogger() {
    const ctx = useContext(LoggerContext);
    if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
    return ctx;
}
