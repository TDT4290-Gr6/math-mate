import { ICountriesRepository } from '../../application/repositories/countries.repository.interface';
import { CountryInsert, Country } from '../../entities/models/country';

export class MockCountriesRepository implements ICountriesRepository {
    private _countries: Country[];

    constructor() {
        this._countries = [];
    }

    async createCountry(country: CountryInsert): Promise<Country> {
        const id = this._countries.length + 1;
        const created = { id, ...country };
        this._countries.push(created);
        return created;
    }

    async getAllCountries(): Promise<Country[]> {
        return this._countries;
    }

    async getCountryById(id: number): Promise<Country | null> {
        const country = this._countries.find((c) => c.id === id);
        return country || null;
    }
}
