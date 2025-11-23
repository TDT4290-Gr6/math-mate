// src/infrastructure/services/chat.service.mock.ts
import { ConversationMessage } from '@/application/use-cases/send-chat-message.use-case';
import { IChatService } from '@/application/services/chat.service.interface';

/**
 * Mock implementation of `IChatService` for testing purposes.
 *
 * Simulates sending messages to a chat AI service and provides predictable
 * mock responses without requiring a real AI backend.
 *
 * @remarks
 * - Returns a mock assistant message based on the last user message.
 * - If the last message is missing or not from a user, returns a default notice.
 *
 * @example
 * const chatService = new MockChatService();
 * const response = await chatService.sendMessage([
 *   { role: 'user', content: 'Hello AI!' }
 * ]);
 * console.log(response.content); // "Mock reply to: "Hello AI!""
 */
export class MockChatService implements IChatService {
    async sendMessage(
        messages: ConversationMessage[],
    ): Promise<ConversationMessage> {
        const lastUserMessage = messages[messages.length - 1];

        // Just in case something weird happens
        if (!lastUserMessage || lastUserMessage.role !== 'user') {
            return {
                role: 'assistant',
                content: 'No user message detected.',
            };
        }

        // Mock AI response
        return {
            role: 'assistant',
            content: `Mock reply to: "${lastUserMessage.content}"`,
        };
    }
}
