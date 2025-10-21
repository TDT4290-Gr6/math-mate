import { describe, it, beforeEach, expect } from 'vitest';
import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';

const createCountryController = getInjection('ICreateCountryController');
const authService = getInjection('IAuthenticationService') as MockAuthenticationService;

describe('createCountryController', () => {
    beforeEach(() => {
        authService.setAuthenticated(true);
    });

    describe('authentication', () => {
        it('throws UnauthenticatedError when user is not logged in', async () => {
            authService.setAuthenticated(false);

            await expect(
                createCountryController({ name: 'Norway' }),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('succeeds when user is authenticated', async () => {
            const result = await createCountryController({ name: 'Norway' });

            expect(result).toMatchObject([
                {
                    id: expect.any(Number),
                    name: 'Norway',
                },
            ]);
        });
    });

     describe('input validation', () => {
        it('throws InputParseError for empty name', async () => {
            await expect(
                createCountryController({ name: '' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

         it('throws InputParseError for invalid characters in name', async () => {
            await expect(
             createCountryController({ name: 'N0rw@y!' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for missing name field', async () => {
            // @ts-expect-error – testing invalid structure intentionally
            await expect(createCountryController({})).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for invalid name type', async () => {
            // @ts-expect-error – testing invalid type intentionally
            await expect(createCountryController({ name: 123 })).rejects.toBeInstanceOf(InputParseError);
        });
    });

    describe('country creation', () => {
        it('returns formatted output from presenter', async () => {
            const result = await createCountryController({ name: 'India' });

            expect(result).toMatchObject([
                {
                    id: expect.any(Number),
                    name: 'India',
                },
            ]);
        });
    });
});

