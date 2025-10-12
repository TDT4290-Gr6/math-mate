'use server';

import {
    ConversationMessage,
    SendMessageResult,
} from '@/application/use-cases/send-chat-message.use-case';
import { getInjection } from '@/di/container';

/**
 * Sends a user message to the chat controller and returns the AI assistant's response.
 *
 * This server-side action performs the following steps:
 * 1. Retrieves the `ISendChatMessageController` instance from the dependency injection container.
 * 2. Calls the controller with the provided message string.
 * 3. Returns the assistant's response.
 * 4. Catches and logs any errors that occur during the process, then throws a generic error to the caller.
 *
 * @param {string} message - The user's message to be sent to the chat service.
 * @returns {Promise<string>} - The response from the AI assistant.
 *
 * @throws {Error} Throws a generic error if the chat controller fails or the message cannot be sent.
 */
export async function sendMessageAction(
    message: string,
): Promise<SendMessageResult> {
    try {
        const chatController = getInjection('ISendChatMessageController');

        const reply = await chatController(message);
        return reply;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Failed to send message:', err.message);
            return {
                success: false,
                error: 'Failed to send message. Please try again.',
            };
        } else {
            console.error('Failed to send message:', err);
            return {
                success: false,
                error: 'Failed to send message. Please try again.',
            };
        }
    }
}
