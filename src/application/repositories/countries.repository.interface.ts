import { Country, CountryInsert } from '@/entities/models/country';

export interface ICountriesRepository {
    createCountry(country: CountryInsert): Promise<Country>;
    getAllCountries(): Promise<Country[]>;
}
