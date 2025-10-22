import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { expect, it, describe, beforeEach } from 'vitest';
import { getInjection } from '@/di/container';

const getProblemsController = getInjection('IGetProblemsController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;

describe('getProblemsController', () => {
    beforeEach(async () => {
        authService.setAuthenticated(true);
    });

    describe('authentication', () => {
        it('throws for unauthenticated user', async () => {
            authService.setAuthenticated(false);

            await expect(
                getProblemsController({ offset: 0, limit: 10 }),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('succeeds for authenticated', async () => {
            const result = await getProblemsController({
                offset: 0,
                limit: 10,
            });

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });
    });

    describe('input validation', () => {
        it('throws InputParseError for negative offset', async () => {
            await expect(
                getProblemsController({ offset: -1, limit: 10 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for zero limit', async () => {
            await expect(
                getProblemsController({ offset: 0, limit: 0 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for limit exceeding 100', async () => {
            await expect(
                getProblemsController({ offset: 0, limit: 101 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for non-integer offset', async () => {
            await expect(
                getProblemsController({ offset: 1.5, limit: 10 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for non-integer limit', async () => {
            await expect(
                getProblemsController({ offset: 0, limit: 10.5 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('accepts valid subjects array', async () => {
            const result = await getProblemsController({
                offset: 0,
                limit: 10,
                subjects: ['Algebra', 'Geometry'],
            });

            expect(Array.isArray(result)).toBe(true);
        });

        it('accepts empty subjects array', async () => {
            const result = await getProblemsController({
                offset: 0,
                limit: 10,
                subjects: [],
            });

            expect(Array.isArray(result)).toBe(true);
        });

        it('accepts undefined subjects', async () => {
            const result = await getProblemsController({
                offset: 0,
                limit: 10,
            });

            expect(Array.isArray(result)).toBe(true);
        });

        it('throws InputParseError for string offset', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                getProblemsController({ offset: '0', limit: 10 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for null offset', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                getProblemsController({ offset: null, limit: 10 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for string limit', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                getProblemsController({ offset: 0, limit: '10' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for null limit', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                getProblemsController({ offset: 0, limit: null }),
            ).rejects.toBeInstanceOf(InputParseError);
        });
        
        it('throws InputParseError for subjects as number', async () => {
            await expect(
                // @ts-expect-error Testing invalid input
                getProblemsController({ offset: 0, limit: 10, subjects: 123 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });
    });
});
