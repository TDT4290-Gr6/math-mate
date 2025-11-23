import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { Country } from '@/entities/models/country';

export type ICreateCountryUseCase = ReturnType<typeof createCountryUseCase>;

/**
 * Creates the `createCountryUseCase` function.
 *
 * This use case is responsible for creating a new country
 * in the provided countries repository.
 *
 * @param countryRepository - An implementation of `ICountriesRepository` used to persist countries.
 * @returns A function that takes a country name and creates a new `Country`.
 *
 * @example
 * const createCountry = createCountryUseCase(countriesRepository);
 * const newCountry = await createCountry("Germany");
 */
export const createCountryUseCase =
    (countryRepository: ICountriesRepository) =>
    async (name: string): Promise<Country> => {
        // HINT: this is where you'd do authorization checks - is this user authorized to create a country

        // HINT: this is where you'd do validation - is the country name valid, does it already exist, etc.

        return countryRepository.createCountry({ name });
    };
