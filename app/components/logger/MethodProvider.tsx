 'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useLogger, type LogEventInput } from '@/components/logger/LoggerProvider';

type MethodContextValue = {
    methodId?: number;
    stepId?: number;
    problemId?: number;
    // returns a logger that automatically enriches payloads with method/step/problem
    getTrackedLogger: () => {
        logEvent: (input: { actionName: string; payload?: unknown; problemId?: number }) => Promise<void>;
    };
};

const MethodContext = createContext<MethodContextValue | undefined>(undefined);

export function MethodProvider({ children, methodId, stepId, problemId }: { children: React.ReactNode; methodId?: number; stepId?: number; problemId?: number }) {
    const logger = useLogger();

    const getTrackedLogger = useCallback(() => ({
        logEvent: async (input: { actionName: string; payload?: unknown; problemId?: number }) => {
            // attach method/step/problem from context automatically only when provided
            const payload = typeof input.payload === 'string' ? input.payload : JSON.stringify(input.payload ?? {});

            const evt: Partial<LogEventInput> & { actionName: string } = {
                actionName: input.actionName,
                payload,
                methodId,
                stepId,
                problemId: input.problemId,
            };

            try {
                await logger.logEvent(evt);
            } catch (err) {
                // swallow logging errors - non-blocking
                console.warn('tracked logEvent failed', err);
            }
        },
    }), [logger, methodId, stepId]);

    // Emit a page_view enriched with available ids when this provider becomes active
    useEffect(() => {
        const tracked = getTrackedLogger();
        const payload: Record<string, unknown> = { source: 'method_provider' };
        if (typeof window !== 'undefined') payload.path = window.location.pathname;
        void tracked.logEvent({ actionName: 'page_view', payload, problemId: problemId });
    }, [getTrackedLogger, problemId]);

    // Listen for the global chat-toggle event and log it with available ids.
    useEffect(() => {
        const handler = () => {
            const tracked = getTrackedLogger();
            void tracked.logEvent({ actionName: 'chat_toggle', payload: { source: 'method_provider' }, problemId: problemId });
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('chat-toggle', handler as EventListener);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('chat-toggle', handler as EventListener);
            }
        };
    }, [getTrackedLogger, problemId]);

    return (
        <MethodContext.Provider value={{ methodId, stepId, problemId, getTrackedLogger }}>
            {children}
        </MethodContext.Provider>
    );
}

export function useMethod() {
    const ctx = useContext(MethodContext);
    if (!ctx) throw new Error('useMethod must be used within MethodProvider');
    return ctx;
}

export function useTrackedLogger() {
    const ctx = useContext(MethodContext);
    const global = useLogger();
    if (!ctx) {
        // fallback to global logger
        return {
            logEvent: async (input: { actionName: string; payload?: unknown; problemId?: number }) => {
                const payload = typeof input.payload === 'string' ? input.payload : JSON.stringify(input.payload ?? {});
                const evt: Partial<LogEventInput> & { actionName: string } = {
                    actionName: input.actionName,
                    payload,
                    problemId: input.problemId,
                    
                };
                await global.logEvent(evt);
            },
        };
    }
    return ctx.getTrackedLogger();
}
