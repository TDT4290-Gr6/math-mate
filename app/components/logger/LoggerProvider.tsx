'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import type { AnalyticsEventMap } from './eventTypes';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export type LogEventInput<K extends keyof AnalyticsEventMap> = {
    actionName: K;
    payload: AnalyticsEventMap[K];
    problemId?: number;
    methodId?: number;
    stepId?: number;
    path?: string;
};

type LoggerContextValue = {
    logEvent: <K extends keyof AnalyticsEventMap>(
        input: LogEventInput<K>,
    ) => Promise<void>;
    sessionId: number;
};

const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

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
    const { data: session } = useSession();
    const sessionId = useRef(getSessionId());

    const logEvent = useCallback(
        async <K extends keyof AnalyticsEventMap>(input: LogEventInput<K>) => {
            // Allow userId to be optionally and send events immediately to be able
            // to restore logs for pre-auth interactions.
            const userId = session?.user?.id
                ? Number(session.user.id)
                : undefined;

            // Normalize payload into an object.
            let payloadObject: Record<string, unknown> = {};

            if (input.payload == null) {
                payloadObject = {};
            } else if (typeof input.payload === 'object') {
                payloadObject = input.payload as Record<string, unknown>;
            } else {
                // fallback for other primitive types
                payloadObject = { value: input.payload };
            }

            // Merge in the current path (path inside payload as requested).
            const mergedPayload = { ...payloadObject, path: pathname };

            const body = {
                userId,
                sessionId: sessionId.current,
                actionName: input.actionName,
                loggedAt: new Date().toISOString(),
                path: input.path ?? pathname, // add current path automatically
                problemId: input.problemId,
                methodId: input.methodId,
                stepId: input.stepId,
                payload: JSON.stringify(mergedPayload),
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
        [session, pathname],
    );

    const lastPathRef = useRef<string | null>(null);
    useEffect(() => {
        if (lastPathRef.current === pathname) return;

        lastPathRef.current = pathname;
        void logEvent({ actionName: 'page_view', payload: { path: pathname } });
    }, [pathname, logEvent]);

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
