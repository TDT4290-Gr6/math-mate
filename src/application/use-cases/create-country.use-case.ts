import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { InputParseError } from '@/src/entities/errors/common';
import { Country } from '@/src/entities/models/country';

export type ICreateCountryUseCase = ReturnType<typeof createCountryUseCase>;

export const createCountryUseCase =
    (countryRepository: ICountriesRepository) =>
    async (name: string): Promise<Country> => {
        // HINT: this is where you'd do authorization checks - is this user authorized to create a country

        // business logic input check
        if (name.length < 1) {
            throw new InputParseError(
                'Country name must be at least 1 character long.',
            );
        }

        return countryRepository.createCountry({ name });
    };
