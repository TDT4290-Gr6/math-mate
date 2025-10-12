// src/infrastructure/services/chat.service.mock.ts
import { ConversationMessage } from '@/application/use-cases/send-chat-message.use-case';
import { IChatService } from '@/application/services/chat.service.interface';

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
