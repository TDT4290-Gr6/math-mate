/**
 * Provides a typed analytics logging system using React context.
 *
 * This module exposes:
 * - `LoggerProvider`: Wraps the app with a context that automatically manages
 *   a session ID and provides a `logEvent` function.
 * - `useLogger`: Hook for accessing the logger context directly.
 * - `useTrackedLogger`: Helper hook that automatically attaches `problemId`
 *   and `methodId` from dynamic route parameters when logging events.
 *
 * Core Features:
 * ----------------
 * • **Session Tracking**
 *   Each client is assigned a session ID (persisted in `sessionStorage`) used
 *   to group analytics events. Server-side rendering generates a temporary ID.
 *
 * • **Typed Event Logging**
 *   The `logEvent` function is fully type-safe and based on `AnalyticsEventMap`.
 *   Every event name automatically infers its correct payload structure.
 *
 * • **Automatic `page_view` Events**
 *   The provider listens for pathname changes via Next.js navigation hooks and
 *   automatically fires a `page_view` event whenever the route changes.
 *
 * • **Route-Aware Logging (`useTrackedLogger`)**
 *   For pages that include `problemId` or `methodId` in their URL, this hook
 *   wraps `logEvent` and merges those parameters into each event payload unless
 *   overridden manually.
 *
 * • **Payload Normalization**
 *   All events automatically include the current `page` value and are stringified
 *   before being sent to the `saveEvent` server action.
 *
 * Types:
 * ----------------
 * - `LogEventInput<K>` — Strict typing for each event and payload.
 * - `LoggerContextValue` — Shape of the logging context.
 *
 * Usage:
 * ----------------
 * ```tsx
 * <LoggerProvider>
 *     <App />
 * </LoggerProvider>
 *
 * const { logEvent } = useLogger();
 * logEvent({ actionName: 'next_step', payload: { current_step: 1, total_steps: 5 } });
 * ```
 */

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

/**
 * Returns a persistent analytics session ID for the current browser session.
 *
 * - On the client, the ID is stored in `sessionStorage` under `logSessionId`
 *   so it remains stable for the duration of the tab session.
 * - On the server (SSR), a temporary random ID is generated since
 *   `sessionStorage` is unavailable.
 *
 * @returns A numeric session ID.
 */
function getSessionId(): number {
    if (typeof window === 'undefined') return Math.floor(Math.random() * 1e9);
    const existing = sessionStorage.getItem('logSessionId');
    if (existing) return Number(existing);
    const newId = Math.floor(Math.random() * 1e9);
    sessionStorage.setItem('logSessionId', newId.toString());
    return newId;
}

/**
 * React provider that initializes and exposes a typed analytics logging system.
 *
 * Features:
 * - Generates or retrieves a persistent session ID.
 * - Exposes a typed `logEvent` function that automatically includes the
 *   current page path in the event payload.
 * - Automatically fires a `page_view` event whenever the route changes.
 *
 * Wrap your application in this provider to enable analytics logging.
 *
 * @param children React children that will receive logging context.
 * @returns The provider wrapping all descendants.
 */
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

/**
 * Provides access to the logging context (`LoggerContext`).
 *
 * This hook must be used inside a `LoggerProvider`, otherwise
 * it will throw an error. It exposes the `logEvent` function and
 * the current session ID used for analytics grouping.
 *
 * @throws If used outside of `LoggerProvider`.
 * @returns The logger context value (logEvent + sessionId).
 */
export function useLogger() {
    const ctx = useContext(LoggerContext);
    if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
    return ctx;
}

/**
 * A helper hook that augments `useLogger()` by automatically attaching
 * `problemId` and `methodId` derived from dynamic route parameters.
 *
 * Useful for pages whose URL includes IDs, such as:
 * `/problems/[problemId]/methods/[methodId]`
 *
 * The returned `logEvent` function:
 * - Merges URL parameters into the event payload unless overridden.
 * - Defers the actual logging using `setTimeout(0)` to avoid blocking render.
 *
 * @returns An object containing a wrapped `logEvent` function.
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
            new Promise<void>((resolve) => {
                setTimeout(() => {
                    logger
                        .logEvent({
                            ...input,
                            problemId: input.problemId ?? problemId,
                            methodId: input.methodId ?? methodId,
                        })
                        .then(resolve, (err) => {
                            console.warn('Deferred logEvent failed', err);
                            resolve();
                        });
                }, 0);
            }),
        [logger, problemId, methodId],
    );
    return { logEvent };
}
