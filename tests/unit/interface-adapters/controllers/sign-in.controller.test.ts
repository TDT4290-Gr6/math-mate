import { InputParseError } from '@/entities/errors/common';
import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const signInController = getInjection('ISignInController');

describe('signInController', () => {
    describe('input validation', () => {
        it('throws InputParseError for missing uuid', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                signInController({}),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for non-string uuid', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                signInController({ uuid: 123 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('succeeds for valid uuid string', async () => {
            const result = await signInController({ uuid: 'test-uuid-123' });

            expect(result).toHaveProperty('userId');
            expect(typeof result.userId).toBe('number');
            expect(result.userId).toBeGreaterThan(0);
        });
    });
});
