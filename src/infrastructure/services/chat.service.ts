import { IChatService } from "@/application/services/chat.service.interface";
import { ChatMessage } from "@/application/use-cases/send-chat-message.use-case";
import OpenAI from "openai";

export class ChatService implements IChatService {
    private openai: OpenAI;

    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY not set in environment");
            }
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async sendMessage(messages: ChatMessage[]): Promise<string> {
        const openAIMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        const response = await this.openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: openAIMessages,
        });
        return response.choices[0]?.message?.content ?? "No response from AI";
    }
}