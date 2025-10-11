import { ChatMessage } from '@/application/use-cases/send-chat-message.use-case';
import { IChatService } from '@/application/services/chat.service.interface';
import OpenAI from 'openai';


/**
 * ChatService is responsible for handling communication with the OpenAI Chat API.
 * 
 * This service converts the application's ChatMessage objects into the format expected
 * by the OpenAI API and sends them to a specified model (gpt-5-mini). It returns
 * the assistant's textual response to the caller.
 * 
 * The OpenAI API key must be provided through the `OPENAI_API_KEY` environment variable.
 * If this key is missing, the service will throw an initialization error.
 */

export class ChatService implements IChatService {
    private openai: OpenAI;

    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY not set in environment');
        }
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async sendMessage(messages: ChatMessage[]): Promise<string> {
        const openAIMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-5-mini',
                messages: openAIMessages,
            });
            return response.choices[0]?.message?.content ?? 'No response from AI';

        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to get response from chat service. Please try again.');
        }
    }
}
