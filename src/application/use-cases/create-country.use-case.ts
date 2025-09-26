import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { Country } from '@/src/entities/models/country';

export type ICreateCountryUseCase = ReturnType<typeof createCountryUseCase>;

export const createCountryUseCase =
    (countryRepository: ICountriesRepository) =>
    async  (name: string): Promise<Country> => {
        
        return countryRepository.createCountry({name});
        
    };
