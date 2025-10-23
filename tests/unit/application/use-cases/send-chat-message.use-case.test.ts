import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const sendChatMessageUseCase = getInjection('ISendChatMessageUseCase');

describe('sendChatMessageUseCase', () => {
    const context = 'Quadratic equation: 2x² + 5x - 3 = 0';
    const userMessage = 'Hello, I need help with this problem';

    describe('successful message sending', () => {
        it('sends message and returns assistant response', async () => {
            const result = await sendChatMessageUseCase(
                1,
                context,
                userMessage,
            );

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toMatchObject({
                    role: 'assistant',
                    content: expect.any(String),
                });
                expect(result.message.content).toContain(
                    'Mock reply to: "Hello, I need help with this problem"',
                );
            }
        });
    });
});
