import { Country, CountryInsert } from '@/src/entities/models/country';

export interface ICountriesRepository {
    createCountry(country: CountryInsert): Promise<Country>;
    getAllCountries(): Promise<Country[]>;
}
