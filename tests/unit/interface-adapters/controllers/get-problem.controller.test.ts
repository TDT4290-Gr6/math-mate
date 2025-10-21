import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { DatabaseOperationError, InputParseError } from '@/entities/errors/common';
import { expect, it, describe, beforeEach } from 'vitest';
import { getInjection } from '@/di/container';

const getProblemController = getInjection('IGetProblemController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;

describe('getProblemController', () => {
    beforeEach(() => {
        authService.setAuthenticated(true);
    });

    describe('authentication', () => {
        it('throws for unauthenticated user', async () => {
            authService.setAuthenticated(false);

            await expect(
                getProblemController({ problemId: 1 }),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('succeeds for authenticated user', async () => {
            const result = await getProblemController({ problemId: 1 });

            expect(result).toMatchObject({
                id: 1,
                title: 'Quadratic Equation',
                problem: 'Solve for x: 2x² + 5x - 3 = 0',
                solution: 'x = 0.5 or x = -3',
                subject: 'Algebra',
                level: 2,
                methods: [],
            });
        });
    });

    describe('input validation', () => {
        it('throws InputParseError for negative problemId', async () => {
            await expect(
                getProblemController({ problemId: -1 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for non-integer problemId', async () => {
            await expect(
                getProblemController({ problemId: 1.5 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });
    });

    describe('problem retrieval', () => {
        it('returns problem for valid existing problemId', async () => {
            const result = await getProblemController({ problemId: 2 });

            expect(result).toMatchObject({
                id: 2,
                title: 'Right Triangle',
                problem:
                    'Find the length of the hypotenuse of a right triangle with legs of length 3 and 4.',
                solution: '5',
                subject: 'Geometry',
                level: 1,
                methods: [],
            });
        });

        it('throws error for non-existent problemId', async () => {
            await expect(
                getProblemController({ problemId: 999 }),
            ).rejects.toBeInstanceOf(DatabaseOperationError);
        });
    });

});
