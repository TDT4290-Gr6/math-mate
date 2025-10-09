import { ChatMessage } from "../use-cases/send-chat-message.use-case";

export interface IChatService {
    sendMessage(messages: ChatMessage[]): Promise<string>;
}
