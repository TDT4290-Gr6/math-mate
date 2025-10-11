'use server';

import { getInjection } from '@/di/container';

export async function sendMessageAction(message: string): Promise<string> {
    try {
        const chatController = getInjection('ISendChatMessageController');

        const reply = await chatController(message);
        return reply;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Failed to send message:', err.message);
        } else {
            console.error('Failed to send message:', err);
        }
        throw new Error('Failed to get chatbot response.');
    }
}
