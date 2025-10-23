import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { expect, it, describe, beforeEach } from 'vitest';
import { getInjection } from '@/di/container';

const sendChatMessageController = getInjection('ISendChatMessageController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;

describe('sendChatMessageController', () => {
    beforeEach(async () => {
        authService.setAuthenticated(true);
    });

    describe('authentication', () => {
        it('returns error for unauthenticated user', async () => {
            authService.setAuthenticated(false);

            const result = await sendChatMessageController('', 'Hello');

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('User must be logged in.');
            }
        });

        it('succeeds for authenticated user', async () => {
            const result = await sendChatMessageController('', 'Hello');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toBeDefined();
                expect(result.message.role).toBe('assistant');
                expect(result.message.content).toContain(
                    'Mock reply to: "Hello"',
                );
            }
        });
    });

    describe('input validation', () => {
        it('returns error for empty message', async () => {
            const result = await sendChatMessageController('', '');

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('Invalid message format.');
            }
        });

        it('returns error for whitespace-only message', async () => {
            const result = await sendChatMessageController('', '   ');

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('Invalid message format.');
            }
        });

        it('returns error for non-string message (number)', async () => {
            // @ts-expect-error Testing invalid input
            const result = await sendChatMessageController('', 123);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('Invalid message format.');
            }
        });

        it('returns error for non-string message (object)', async () => {
            // @ts-expect-error Testing invalid input
            const result = await sendChatMessageController('', {
                message: 'hello',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('Invalid message format.');
            }
        });

        it('returns error for non-string message (null)', async () => {
            // @ts-expect-error Testing invalid input
            const result = await sendChatMessageController('', null);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe('Invalid message format.');
            }
        });

        it('returns error for message exceeding 2000 characters', async () => {
            const longMessage = 'a'.repeat(2001);
            const result = await sendChatMessageController('', longMessage);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error).toBe(
                    'Message exceeds maximum length of 2000 characters.',
                );
            }
        });

        it('accepts message at exactly 2000 characters', async () => {
            const message = 'a'.repeat(2000);
            const result = await sendChatMessageController('', message);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toBeDefined();
            }
        });

        it('trims message content', async () => {
            const result = await sendChatMessageController('', '  Hello      ');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message.content).toContain(
                    'Mock reply to: "Hello"',
                );
            }
        });
    });

    describe('context handling', () => {
        it('accepts valid string context', async () => {
            const context = 'This is a math problem about algebra';
            const result = await sendChatMessageController(context, 'Hello');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toBeDefined();
            }
        });

        it('handles empty context', async () => {
            const result = await sendChatMessageController('', 'Hello');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toBeDefined();
            }
        });

        it('handles non-string context (number)', async () => {
            // @ts-expect-error Testing invalid input
            const result = await sendChatMessageController(123, 'Hello');

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.message).toBeDefined();
            }
        });
    });
});
