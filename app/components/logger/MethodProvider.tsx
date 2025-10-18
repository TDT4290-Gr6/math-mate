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
import { useParams, usePathname } from 'next/navigation';
import { AnalyticsEventMap } from './eventTypes';

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

export function MethodProvider({ children }: { children: React.ReactNode }) {
    const logger = useLogger();
    const path = usePathname();
    const lastLoggedPath = useRef<string | null>(null);
    const params = useParams();

    const methodId = params?.methodId ? Number(params.methodId) : undefined;
    const problemId = params?.problemId ? Number(params.problemId) : undefined;
    const stepId = undefined;

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
                await logger.logEvent(evt);
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
