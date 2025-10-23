import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const signInUseCase = getInjection('ISignInUseCase');

describe('signInUseCase', () => {
    describe('user retrieval', () => {
        it('creates new user when uuid does not exist', async () => {
            const newUuid = 'new-user-uuid';
            const result = await signInUseCase(newUuid);

            expect(result).toMatchObject({
                id: 2,
                uuid: newUuid,
                score: 0, // Default score for new users
            });
        });

        it('fetches the exsiting user when uuid exist', async () => {
            const newUuid = 'new-user-uuid';
            const result = await signInUseCase(newUuid);

            expect(result).toMatchObject({
                id: 2,
                uuid: newUuid,
                score: 0,
            });
        });
    });

    describe('user data validation', () => {
        it('returns user with all required fields', async () => {
            const result = await signInUseCase('test-uuid');

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('uuid');
            expect(result).toHaveProperty('score');
        });

        it('returns user with correct data structure', async () => {
            const result = await signInUseCase('existing-user-uuid');

            expect(typeof result.id).toBe('number');
            expect(typeof result.uuid).toBe('string');
            expect(typeof result.score).toBe('number');
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(5);
        });
    });
});
