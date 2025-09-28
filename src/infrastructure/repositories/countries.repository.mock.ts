import { ICountriesRepository } from '../../application/repositories/countries.repository.interface';
import { CountryInsert, Country } from '../../entities/models/country';

export class CountriesRepositoryMock implements ICountriesRepository {
    private _countries: Country[];

    constructor() {
        this._countries = [];
    }

    async createCountry(country: CountryInsert): Promise<Country> {
        const id = this._countries.length.toString();
        const created = { id, ...country };
        this._countries.push(created);
        return created;
    }

    async getAllCountries(): Promise<Country[]> {
        return this._countries;
    }
}
