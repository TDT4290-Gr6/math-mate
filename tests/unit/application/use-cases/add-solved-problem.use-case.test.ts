import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const addSolvedProblemUseCase = getInjection('IAddSolvedProblemUseCase');

describe('addSolvedProblemUseCase', () => {
    describe('successful solve creation', () => {
        it('creates solve for user', async () => {
            const validInput = {
                userId: 1,
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            const result = await addSolvedProblemUseCase(validInput);

            expect(result).toMatchObject({
                id: expect.any(Number),
                userId: 1,
                problemId: 1,
                attempts: expect.any(Number),
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            });
        });

        it('creates solve with minimal required fields', async () => {
            const minimalInput = {
                userId: 1,
                problemId: 2,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 5,
            };

            const result = await addSolvedProblemUseCase(minimalInput);

            expect(result).toMatchObject({
                id: expect.any(Number),
                userId: 1,
                problemId: 2,
                attempts: expect.any(Number),
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 5,
            });
            expect(result.finishedSolvingAt).toBeUndefined();
            expect(result.feedback).toBeUndefined();
            expect(result.wasCorrect).toBeUndefined();
        });
    });

    describe('data structure validation', () => {
        it('returns solve with correct data types', async () => {
            const validInput = {
                userId: 1,
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            const result = await addSolvedProblemUseCase(validInput);

            expect(typeof result.id).toBe('number');
            expect(typeof result.userId).toBe('number');
            expect(typeof result.problemId).toBe('number');
            expect(typeof result.attempts).toBe('number');
            expect(result.startedSolvingAt).toBeInstanceOf(Date);
            expect(typeof result.stepsUsed).toBe('number');
            expect(result.finishedSolvingAt).toBeInstanceOf(Date);
            expect(typeof result.feedback).toBe('number');
            expect(typeof result.wasCorrect).toBe('boolean');
        });

        it('returns solve with all required fields', async () => {
            const validInput = {
                userId: 1,
                problemId: 2,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 5,
            };

            const result = await addSolvedProblemUseCase(validInput);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('userId');
            expect(result).toHaveProperty('problemId');
            expect(result).toHaveProperty('attempts');
            expect(result).toHaveProperty('startedSolvingAt');
            expect(result).toHaveProperty('stepsUsed');
        });
    });
});
