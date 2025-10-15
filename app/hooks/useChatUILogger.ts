'use client';

import { useLogger } from '@/components/logger/LoggerProvider';

export function useChatUILogger({
    page,
    problemId,
}: {
    page: string;
    problemId?: number;
}) {
    const logger = useLogger();

    const logChatOpen = () =>
        logger.logEvent({
            actionName: 'chat_open',
            payload: { page, problemId },
        });
    const logChatClose = () =>
        logger.logEvent({
            actionName: 'chat_close',
            payload: { page, problemId },
        });

    return { logChatOpen, logChatClose };
}
