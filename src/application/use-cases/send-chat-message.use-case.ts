import { IChatService } from '../services/chat.service.interface';

export type ISendChatMessageUseCase = ReturnType<typeof sendChatMessageUseCase>;
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

const systemPrompt = `
            You are a helpful math tutor chatbot. 
            You should only respond to math-related questions.

            If the user provides step-by-step explanations, your role is to help them understand those steps.
            If no steps are provided, you should offer clear step-by-step guidance on how to solve the problem — but do not give the final answer.

            All math expressions must use LaTeX syntax:
            - Use "$...$" for inline math.
            - Use "$$...$$" for block math (when showing multiple lines or long equations).
            Do not use square brackets "[]" or commas "," inside LaTeX expressions.
            Always format your response in Markdown, and use list formatting where appropriate.
            `;

export const sendChatMessageUseCase = (chatService: IChatService) => {
    const conversation: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
    ];

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
        const botReply = await chatService.sendMessage(conversation);
        conversation.push({ role: 'assistant', content: botReply });
        return botReply;
    };
};
