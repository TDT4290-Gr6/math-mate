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
import { AnalyticsEventMap } from './eventTypes';
import { usePathname } from 'next/navigation';

type MethodContextValue = {
    methodId?: number;
    stepId?: number;
    problemId?: number;
    getTrackedLogger: () => {
        logEvent: <K extends keyof AnalyticsEventMap>(
            input: Omit<
                LogEventInput<K>,
                'methodId' | 'problemId' | 'stepId'
            > & {
                methodId?: number;
                problemId?: number;
                stepId?: number;
            },
        ) => Promise<void>;
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
            logEvent: async <K extends keyof AnalyticsEventMap>(
                input: Omit<
                    LogEventInput<K>,
                    'methodId' | 'problemId' | 'stepId'
                > & {
                    methodId?: number;
                    problemId?: number;
                    stepId?: number;
                },
            ) => {
                const evt: LogEventInput<K> = {
                    ...input,
                    methodId: input.methodId ?? methodId,
                    problemId: input.problemId ?? problemId,
                    stepId: input.stepId ?? stepId,
                };

                try {
                    await logger.logEvent(evt);
                } catch (err) {
                    console.warn('tracked logEvent failed', err);
                }
            },
        }),
        [logger, methodId, problemId, stepId],
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (lastLoggedPath.current !== path) {
            lastLoggedPath.current = path;
            const tracked = getTrackedLogger();
            void tracked.logEvent({
                actionName: 'page_view',
                payload: { path },
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
        return {
            logEvent: async <K extends keyof AnalyticsEventMap>(
                input: LogEventInput<K>,
            ) => {
                await global.logEvent(input);
            },
        };
    }

    return ctx.getTrackedLogger();
}
