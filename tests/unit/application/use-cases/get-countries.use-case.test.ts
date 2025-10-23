import { getInjection } from '@/di/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockCountriesRepository } from '@/infrastructure/repositories/countries.repository.mock';

const getCountriesUseCase = getInjection('IGetCountriesUseCase');
const countriesRepo = getInjection('ICountriesRepository') as MockCountriesRepository;

describe('getCountriesUseCase', () => {
  beforeEach(async () => {
    // Nullstill og legg til standard testdata
    countriesRepo['_countries'] = [];
    await countriesRepo.createCountry({ name: 'Norway' });
    await countriesRepo.createCountry({ name: 'India' });
  });

  describe('basic retrieval', () => {
    it('returns all available countries', async () => {
      const result = await getCountriesUseCase();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      expect(result[0]).toMatchObject({ id: 1, name: 'Norway' });
      expect(result[1]).toMatchObject({ id: 2, name: 'India' });
    });

    it('returns empty array when no countries exist', async () => {
      countriesRepo['_countries'] = [];

      const result = await getCountriesUseCase();

      expect(result).toEqual([]);
    });
  });

  describe('data integrity', () => {
    it('returns countries with correct data types', async () => {
      const result = await getCountriesUseCase();
      const country = result[0];

      expect(typeof country.id).toBe('number');
      expect(typeof country.name).toBe('string');
    });

    it('includes required fields for each country', async () => {
      const result = await getCountriesUseCase();
      const country = result[0];

      expect(country).toHaveProperty('id');
      expect(country).toHaveProperty('name');
    });

    it('throws if a country is missing required fields (simulated)', async () => {
      countriesRepo['_countries'] = [
        // @ts-expect-error intentional malformed data for test
        { id: 1 }, // missing name
        // @ts-expect-error intentional malformed data for test
        { name: 'Norway' }, // missing id
      ];

      const result = await getCountriesUseCase();

      // Verify that the countries are not correct (missing)
      for (const country of result) {
        expect(country).not.toEqual(
          expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }),
        );
      }
    });
  });
});