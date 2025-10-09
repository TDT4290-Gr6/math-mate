'use client';

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type LogPayload = Record<string, unknown>;

export type LogEventInput = {
    userId: number;
    sessionId: string;
    actionName: string;
    problemId?: number;
    methodId?: number;
    stepId?: number;
    payload?: string | LogPayload;
};

type LoggerContextValue = {
    logEvent: (input: Partial<LogEventInput> & { actionName: string }) => Promise<void>;
    sessionId: string;
};

const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

function makeSessionId() {
    // numeric session id so it can be stored as BigInt if needed
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function LoggerProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const sessionIdRef = useRef<string>('');

    if (!sessionIdRef.current) {
        try {
            const existing = typeof localStorage !== 'undefined' ? localStorage.getItem('mm:sessionId') : null;
            if (existing) sessionIdRef.current = existing;
            else {
                const s = makeSessionId();
                try {
                    localStorage.setItem('mm:sessionId', s);
                } catch {}
                sessionIdRef.current = s;
            }
        } catch {
            sessionIdRef.current = makeSessionId();
        }
    }

    const sessionId = sessionIdRef.current;

    const logEvent = useCallback(async (input: Partial<LogEventInput> & { actionName: string }) => {
        const body = {
            // default to 1 for quick testing (Zod requires userId >= 1)
            userId: 4,
            sessionId,
            actionName: input.actionName,
            loggedAt: new Date().toISOString(),
            problemId: input.problemId,
            methodId: input.methodId,
            stepId: input.stepId,
            payload: typeof input.payload === 'string' ? input.payload : JSON.stringify(input.payload ?? {}),
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
    }, [sessionId]);

    const lastPathRef = useRef<string | null>(null);
    useEffect(() => {
        if (!pathname) return;
        if (lastPathRef.current === pathname) return;
        lastPathRef.current = pathname;
        void logEvent({ actionName: 'page_view', payload: { path: pathname } });
    }, [pathname, logEvent]);

    return <LoggerContext.Provider value={{ logEvent, sessionId }}>{children}</LoggerContext.Provider>;
}

export function useLogger() {
    const ctx = useContext(LoggerContext);
    if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
    return ctx;
}
