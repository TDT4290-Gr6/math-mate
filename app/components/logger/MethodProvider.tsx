'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useRef,
} from 'react';
import {
    useLogger,
    type LogEventInput,
} from '@/components/logger/LoggerProvider';
import { usePathname } from 'next/navigation';

type MethodContextValue = {
    methodId?: number;
    stepId?: number;
    problemId?: number;
    // returns a logger that automatically enriches payloads with method/step/problem
    getTrackedLogger: () => {
        logEvent: (input: {
            actionName: string;
            payload?: unknown;
            problemId?: number;
            stepId?: number;
        }) => Promise<void>;
    };
};

const MethodContext = createContext<MethodContextValue | undefined>(undefined);

export function MethodProvider({
    children,
    methodId,
    stepId,
    problemId,
}: {
    children: React.ReactNode;
    methodId?: number;
    stepId?: number;
    problemId?: number;
}) {
    const logger = useLogger();
    const path = usePathname();
    const lastLoggedPath = useRef<string | null>(null);

    const getTrackedLogger = useCallback(
        () => ({
            logEvent: async (input: {
                methodId?: number;
                stepId?: number;
                actionName: string;
                payload?: unknown;
            }) => {
                // attach method/step/problem from context automatically only when provided
                const payload =
                    typeof input.payload === 'string'
                        ? input.payload
                        : JSON.stringify(input.payload ?? {});

                const evt: Partial<LogEventInput> & { actionName: string } = {
                    actionName: input.actionName,
                    payload,
                    methodId,
                    problemId: problemId,
                    stepId: input.stepId ?? stepId,
                };

                try {
                    await logger.logEvent(evt);
                } catch (err) {
                    // swallow logging errors - non-blocking
                    console.warn('tracked logEvent failed', err);
                }
            },
        }),
        [logger, methodId, problemId, stepId],
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Only log if the path is new
        if (lastLoggedPath.current !== path) {
            lastLoggedPath.current = path;
            const tracked = getTrackedLogger();
            void tracked.logEvent({
                actionName: 'page_view',
                payload: { path },
                stepId: undefined,
                methodId: undefined,
            });
        }
    }, [path, getTrackedLogger]);

    return (
        <MethodContext.Provider
            value={{ methodId, stepId, problemId, getTrackedLogger }}
        >
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
            logEvent: async (input: {
                actionName: string;
                payload?: unknown;
                problemId?: number;
                methodId?: number;
            }) => {
                const payload =
                    typeof input.payload === 'string'
                        ? input.payload
                        : JSON.stringify(input.payload ?? {});
                const evt: Partial<LogEventInput> & { actionName: string } = {
                    actionName: input.actionName,
                    payload,
                    problemId: input.problemId,
                    methodId: input.methodId,
                };
                await global.logEvent(evt);
            },
        };
    }
    return ctx.getTrackedLogger();
}
