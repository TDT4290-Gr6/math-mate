import { MockCountriesRepository } from '@/infrastructure/repositories/countries.repository.mock';
import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { expect, it, describe, beforeEach } from 'vitest';
import { getInjection } from '@/di/container';

const getCountriesController = getInjection('IGetCountriesController');
const authService = getInjection(
    'IAuthenticationService',
) as MockAuthenticationService;
const countriesRepo = getInjection(
    'ICountriesRepository',
) as MockCountriesRepository;

describe('getCountriesController', () => {
    beforeEach(async () => {
        authService.setAuthenticated(true);
        countriesRepo['_countries'] = [];

        await countriesRepo.createCountry({ name: 'Norway' });
        await countriesRepo.createCountry({ name: 'India' });
    });

    describe('authentication', () => {
        it('should throw an UnauthenticatedError if the user is not authenticated/logged in', async () => {
            authService.setAuthenticated(false);

            await expect(getCountriesController()).rejects.toBeInstanceOf(
                UnauthenticatedError,
            );
        });

        it('should allow access when the user is authenticated ', async () => {
            const result = await getCountriesController();

            expect(result).toMatchObject([
                { id: 1, name: 'Norway' },
                { id: 2, name: 'India' },
            ]);
        });
    });

    describe('country retrieval and output formatting', () => {
        it('should return all available countries in the expected format', async () => {
            const result = await getCountriesController();

            expect(result).toHaveLength(2);

            // Verify fomat of each country
            expect(result[0]).toMatchObject({
                id: expect.any(Number),
                name: 'Norway',
            });
            expect(result[1]).toMatchObject({
                id: expect.any(Number),
                name: 'India',
            });
        });

        it('should return an empty array when no countries exist in the repository', async () => {
            // Remove countries from repp
            countriesRepo['_countries'] = [];

            const result = await getCountriesController();

            // Assert list of countries is empty
            expect(result).toEqual([]);
        });
    });
});
