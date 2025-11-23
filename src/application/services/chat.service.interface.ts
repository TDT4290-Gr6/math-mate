import { ConversationMessage } from '../use-cases/send-chat-message.use-case';

/**
 * Interface for a chat service that handles conversation messages.
 */
export interface IChatService {
    /**
     * Sends a series of conversation messages to the chat service and returns the assistant's response.
     *
     * @param messages - An array of `ConversationMessage` objects representing the conversation history.
     * @returns A promise that resolves to a `ConversationMessage` representing the assistant's reply.
     */
    sendMessage(messages: ConversationMessage[]): Promise<ConversationMessage>;
}
