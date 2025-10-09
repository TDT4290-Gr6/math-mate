import { IChatService } from '../services/chat.service.interface';

export type ISendChatMessageUseCase = ReturnType<typeof sendChatMessageUseCase>;
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

const systemPrompt = `
            You are a helpful math tutor chatbot.
            You should only respond to math-related questions.
            The user is provided with step-by-step explanations for the question, 
            and your task is to help understand the steps, or if no steps selected,
            you can provide steps to solve the question. You should not give the final answer.
            The service is markdown compatible, and you should format math expressions using LaTeX syntax
            `;

export const sendChatMessageUseCase = (chatService?: IChatService) => {
    const conversation: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
    ];
    const service =
        chatService ??
        new (require('@/infrastructure/services/chat.service').ChatService)();

    return async (message: string) => {
        conversation.push({ role: 'user', content: message });

        // Limit conversation history to last 5 messages to manage token usage
        const MAX_MESSAGES = 5;
        if (conversation.length > MAX_MESSAGES) {
            // Keep system + last (MAX_MESSAGES-1) messages
            const systemMessage = conversation[0];
            const recentMessages = conversation.slice(-(MAX_MESSAGES - 1));
            conversation.length = 0;
            conversation.push(systemMessage, ...recentMessages);
        }

        // Call chat service to get response
        const botReply = await service.sendMessage(conversation);
        conversation.push({ role: 'assistant', content: botReply });
        return botReply;
    };
};
