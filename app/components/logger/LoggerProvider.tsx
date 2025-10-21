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
import { saveEvent } from '@/actions';

export type LogEventInput<K extends keyof AnalyticsEventMap> = {
    actionName: K;
    payload: AnalyticsEventMap[K];
    problemId?: number;
    methodId?: number;
    stepId?: number;
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
    const sessionId = useRef(getSessionId());
    const logEvent = useCallback(
        async <K extends keyof AnalyticsEventMap>(input: LogEventInput<K>) => {
            // Merge path automatically into payload
            const payload = {
                ...(typeof input.payload === 'object'
                    ? input.payload
                    : { value: input.payload }),
                page: pathname,
            };
            try {
                await saveEvent(
                    sessionId.current,
                    input.actionName,
                    input.problemId,
                    input.methodId,
                    input.stepId,
                    JSON.stringify(payload),
                );
            } catch (err) {
                console.warn('logEvent failed', err);
            }
        },
        [pathname],
    );

    // Automatic page_view logging
    const lastPathRef = useRef<string | null>(null);
    useEffect(() => {
        if (lastPathRef.current === pathname) return;
        lastPathRef.current = pathname;
        void logEvent({
            actionName: 'page_view',
            payload: {
                page: pathname,
            },
        });
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

    const parseNumericParam = (
        value: string | string[] | undefined,
    ): number | undefined => {
        if (!value || Array.isArray(value)) return undefined;
        const num = Number(value);
        return Number.isNaN(num) ? undefined : num;
    };

    const problemId = parseNumericParam(params?.problemId);
    const methodId = parseNumericParam(params?.methodId);

    const logEvent = useCallback(
        <K extends keyof AnalyticsEventMap>(input: LogEventInput<K>) =>
            logger.logEvent({
                ...input,
                problemId: input.problemId ?? problemId,
                methodId: input.methodId ?? methodId,
            }),
        [logger, problemId, methodId],
    );
    return { logEvent };
}
