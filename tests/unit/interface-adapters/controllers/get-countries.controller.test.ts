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
    it('throws an UnauthenticatedError if the user is not authenticated/logged in', async () => {
      authService.setAuthenticated(false);

            await expect(getCountriesController()).rejects.toBeInstanceOf(
                UnauthenticatedError,
            );
        });

    it('returns countries when the user is authenticated ', async () => {
      const result = await getCountriesController();

            expect(result).toMatchObject([
                { id: 1, name: 'Norway' },
                { id: 2, name: 'India' },
            ]);
        });
    });

  describe('country retrieval and output formatting', () => {
    it('returns all countries with correct structure', async () => {
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

    it('returns an empty array when no countries exist', async () => {
      // Remove countries from repp
      countriesRepo['_countries'] = [];

            const result = await getCountriesController();

      expect(result).toEqual([]);
    });

    it('ensures returned countries follow the expected format', async () => {
      const result = await getCountriesController();

      for (const country of result) {
        expect(Object.keys(country).sort()).toEqual(['id', 'name']);
        expect(typeof country.id).toBe('number');
        expect(typeof country.name).toBe('string');
      }
    });
  });
});
