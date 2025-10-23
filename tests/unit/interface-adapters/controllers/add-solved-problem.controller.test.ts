import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { InputParseError } from '@/entities/errors/common';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { expect, it, describe, beforeEach } from 'vitest';
import { getInjection } from '@/di/container';

const addSolvedProblemController = getInjection('IAddSolvedProblemController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;

describe('addSolvedProblemController', () => {
    beforeEach(() => {
        authService.setAuthenticated(true);
    });

    describe('authentication', () => {
        it('throws for unauthenticated user', async () => {
            authService.setAuthenticated(false);

            const validInput = {
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            await expect(
                addSolvedProblemController(validInput),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('succeeds for authenticated user', async () => {
            const validInput = {
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            const result = await addSolvedProblemController(validInput);

            expect(result).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                problemId: 1,
                attempts: expect.any(Number),
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            });
        });
    });

    describe('input validation', () => {
        it('throws InputParseError for missing required fields', async () => {
            const invalidInput = {
                problemId: 1,
                // missing startedSolvingAt
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            await expect(
                addSolvedProblemController(invalidInput),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for invalid problemId', async () => {
            const invalidInput = {
                problemId: -1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            await expect(
                addSolvedProblemController(invalidInput),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for negative stepsUsed', async () => {
            const invalidInput = {
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: -1,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 4,
                wasCorrect: true,
            };

            await expect(
                addSolvedProblemController(invalidInput),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for invalid feedback range', async () => {
            const invalidInput = {
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2024-01-01T10:05:00Z'),
                feedback: 6, // should be 1-5
                wasCorrect: true,
            };

            await expect(
                addSolvedProblemController(invalidInput),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('accepts valid input with optional fields missing', async () => {
            const validInput = {
                problemId: 1,
                startedSolvingAt: new Date('2024-01-01T10:00:00Z'),
                stepsUsed: 3,
                // finishedSolvingAt is optional
                // feedback is optional
                // wasCorrect is optional
            };

            const result = await addSolvedProblemController(validInput);

            expect(result).toMatchObject({
                problemId: 1,
                stepsUsed: 3,
            });
            expect(result.finishedSolvingAt).toBeUndefined();
            expect(result.feedback).toBeUndefined();
            expect(result.wasCorrect).toBeUndefined();
        });
    });
});
