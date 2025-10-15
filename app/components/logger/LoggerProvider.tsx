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
    sessionId: number;
};

const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

// generate per-browser-session ID
function getSessionId(): number {
    if (typeof window === 'undefined') return Math.floor(Math.random() * 1e9);

    const existing = sessionStorage.getItem('logSessionId');
    if (existing) return Number(existing);

    const newId = Math.floor(Math.random() * 1e9);
    sessionStorage.setItem('logSessionId', newId.toString());
    return newId;
}

export function LoggerProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession(); // track status

    // Extract sessionId from session if available
    // Persistent per-browser-session ID
    const sessionId = useRef(getSessionId());

    const logEvent = useCallback(
        async (input: Partial<LogEventInput> & { actionName: string }) => {
            // Wait for session to be loaded and userId to exist
            if (status !== 'authenticated' || !session?.user?.id) {
                console.warn('logEvent skipped: session not ready');
                return;
            }

            const userId = Number(session.user.id);

            const body = {
                userId,
                sessionId: sessionId.current,
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
        [session, status, sessionId],
    );

    const lastPathRef = useRef<string | null>(null);
    useEffect(() => {
        if (!pathname || status !== 'authenticated') return;
        if (lastPathRef.current === pathname) return;

        lastPathRef.current = pathname;
        void logEvent({ actionName: 'page_view', payload: { path: pathname } });
    }, [pathname, logEvent, status]);

    return (
        <LoggerContext.Provider
            value={{ logEvent, sessionId: sessionId.current }}
        >
            {children}
        </LoggerContext.Provider>
    );
}

export function useLogger() {
    const ctx = useContext(LoggerContext);
    if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
    return ctx;
}
