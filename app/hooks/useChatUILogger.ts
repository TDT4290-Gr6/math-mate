'use client';

import { useLogger } from '@/components/logger/LoggerProvider';

export function useChatUILogger({
    page,
    problemId,
    methodId,
}: {
    page: string;
    problemId?: number;
    methodId?: number;
}) {
    const logger = useLogger();

    const logChatOpen = () =>
        void logger.logEvent({
            actionName: 'chat_open',
            problemId: problemId,
            methodId: methodId,
            payload: { page },
        });

    const logChatClose = () =>
        void logger.logEvent({
            actionName: 'chat_close',
            payload: { page, problemId, methodId },
        });

    return { logChatOpen, logChatClose };
    return { logChatOpen, logChatClose };
}
