import { ConversationMessage } from '@/application/use-cases/send-chat-message.use-case';
import { IChatService } from '@/application/services/chat.service.interface';
import OpenAI from 'openai';

/**
 * ChatService handles communication with the OpenAI Chat Completions API.
 *
 * This service formats the application's ConversationMessage objects for the OpenAI API,
 * sends them to the GPT-4o model, and returns the assistant's response.
 *
 * GPT-4o is used for its balance of reasoning ability and speed, making it well-suited
 * for educational and tutoring use cases such as math help.
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

    async sendMessage(
        messages: ConversationMessage[],
    ): Promise<ConversationMessage> {
        const openAIMessages = messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: openAIMessages,
                temperature: 0.7, // Balanced creativity for tutoring explanations
                max_tokens: 500, // Enough space for step-by-step reasoning
            });

            const content =
                response.choices[0]?.message?.content ?? 'No response from AI';

            return {
                role: 'assistant',
                content,
            };
        } catch (error: unknown) {
            console.error('OpenAI API error:', error);

            // Narrow the type safely
            if (
                error &&
                typeof error === 'object' &&
                ('code' in error || 'status' in error)
            ) {
                const err = error as { code?: string; status?: number };
                if (
                    err.code === 'ENOTFOUND' ||
                    err.code === 'ECONNREFUSED' ||
                    err.status === 503
                ) {
                    throw new Error(
                        'The AI service is currently offline or unreachable. Please try again later.',
                    );
                }
                if (err.status === 429) {
                    throw new Error(
                        'The AI service is temporarily overloaded. Please wait and try again.',
                    );
                }
            }

            throw new Error(
                'Failed to get response from chat service. Please try again.',
            );
        }
    }
}
