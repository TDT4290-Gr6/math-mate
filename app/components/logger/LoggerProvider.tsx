'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { usePathname, useParams } from 'next/navigation';
import type { AnalyticsEventMap } from './eventTypes';
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
            const userId = session?.user?.id
                ? Number(session.user.id)
                : undefined;

            // Only log if there is a userId
            if (!userId) return;

            // Merge path automatically into payload
            const payload = {
                ...(typeof input.payload === 'object'
                    ? input.payload
                    : { value: input.payload }),
                page: pathname,
            };

            const body = {
                userId,
                sessionId: sessionId.current,
                actionName: input.actionName,
                loggedAt: new Date().toISOString(),
                problemId: input.problemId,
                methodId: input.methodId,
                stepId: input.stepId,
                payload: JSON.stringify(payload),
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

    // Automatic page_view logging
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

/**
 * Optional helper hook for pages that have problemId / methodId in the URL.
 */
export function useTrackedLogger() {
    const logger = useLogger();
    const params = useParams();
    const pathname = usePathname();

    const problemId = params?.problemId ? Number(params.problemId) : undefined;
    const methodId = params?.methodId ? Number(params.methodId) : undefined;

    const logEvent = useCallback(
        <K extends keyof AnalyticsEventMap>(input: LogEventInput<K>) =>
            logger.logEvent({
                ...input,
                problemId: input.problemId ?? problemId,
                methodId: input.methodId ?? methodId,
                path: input.path ?? pathname,
            }),
        [logger, problemId, methodId, pathname],
    );
    return { logEvent };
}
