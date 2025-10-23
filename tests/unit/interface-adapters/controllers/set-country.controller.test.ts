import { MockCountriesRepository } from '@/infrastructure/repositories/countries.repository.mock';
import { MockUsersRepository } from '@/infrastructure/repositories/users.repository.mock';
import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { describe, it, beforeEach, expect } from 'vitest';
import { getInjection } from '@/di/container';

const setCountryController = getInjection('ISetCountryController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;
const countriesRepo = getInjection(
    'ICountriesRepository',
) as MockCountriesRepository;
const usersRepo = getInjection('IUsersRepository') as MockUsersRepository;

describe('setCountryController', () => {
    beforeEach(async () => {
        authService.setAuthenticated(true);
        authService.setCurrentUserId(1);

        // Reset and prepare test state
        countriesRepo['_countries'] = [];
        usersRepo['_users'] = [];

        // Create valid user and country to avoid use case errors
        await usersRepo.createUser({ uuid: 'user-uuid-1' });
        await countriesRepo.createCountry({ name: 'Norway' });
    });

    describe('authentication', () => {
        it('throws UnauthenticatedError when user is not logged in', async () => {
            authService.setAuthenticated(false);

            await expect(
                setCountryController({ countryId: 1 }),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('throws UnauthenticatedError when user ID is not set', async () => {
            authService.setCurrentUserId(null);

            await expect(
                setCountryController({ countryId: 1 }),
            ).rejects.toBeInstanceOf(UnauthenticatedError);
        });
    });

    describe('input validation', () => {
        it('throws InputParseError for negative countryId', async () => {
            await expect(
                setCountryController({ countryId: -1 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for countryId not being an integer', async () => {
            await expect(
                setCountryController({ countryId: 2.5 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });
    });

    describe('country setting', () => {
        it('returns success when authenticated user sets an existing country', async () => {
            const result = await setCountryController({ countryId: 1 });

            expect(result).toMatchObject({ success: true });
        });
    });
});
