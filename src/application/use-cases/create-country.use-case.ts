import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { Country } from '@/entities/models/country';

export type ICreateCountryUseCase = ReturnType<typeof createCountryUseCase>;

export const createCountryUseCase =
    (countryRepository: ICountriesRepository) =>
    async (name: string): Promise<Country> => {
        // HINT: this is where you'd do authorization checks - is this user authorized to create a country

        return countryRepository.createCountry({ name });
    };
