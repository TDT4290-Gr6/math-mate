import { ConversationMessage } from '../use-cases/send-chat-message.use-case';

export interface IChatService {
    sendMessage(messages: ConversationMessage[]): Promise<ConversationMessage>;
}
