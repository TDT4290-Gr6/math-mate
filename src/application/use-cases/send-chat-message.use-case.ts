import { IChatService } from '../services/chat.service.interface';

/**
 * The type alias representing the structure of the send chat message use case.
 * This type allows dependency injection systems or controllers to infer the return type of the factory.
 */
export type ISendChatMessageUseCase = ReturnType<typeof sendChatMessageUseCase>;

/**
 * Represents a single message in a chat conversation.
 * Each message has a role (system, user, or assistant) and textual content.
 */
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

/**
 * A predefined system prompt that establishes the chatbot's role and behavior.
 */
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

/**
 * A temporary in-memory store that keeps track of each user's conversation history.
 *
 * The key is the user's unique ID, and the value is the list of chat messages
 * (including the system prompt, user messages, and assistant responses).
 *
 * Note: This store is not persistent and will reset if the server restarts.
 * For scalability or multi-instance deployment, consider using a shared external store (e.g., Redis or database).
 */
const conversationStore = new Map<number, ChatMessage[]>();

/**
 * A use case that handles sending and receiving chat messages between the user and the AI model.
 *
 * @param {IChatService} chatService - The chat service responsible for communicating with the AI model (e.g., OpenAI API).
 * @returns {Function} An async function that takes a user ID and message, manages conversation context, and returns the AI's response.
 */
export const sendChatMessageUseCase = (chatService: IChatService) => {
    return async (userID: number, message: string) => {
        let conversation = conversationStore.get(userID);
        if (!conversation) {
            conversation = [{ role: 'system', content: systemPrompt }];
            conversationStore.set(userID, conversation);
        }

        conversation.push({ role: 'user', content: message });

        // Limit conversation history to last 5 messages plus system prompt
        const MAX_MESSAGES = 5;
        if (conversation.length > MAX_MESSAGES) {
            const systemMessage = conversation[0];
            const recentMessages = conversation.slice(-(MAX_MESSAGES - 1));
            conversationStore.set(userID, [systemMessage, ...recentMessages]);
        }

        const botReply = await chatService.sendMessage(conversation);
        conversation.push({ role: 'assistant', content: botReply });

        return botReply;
    };
};
