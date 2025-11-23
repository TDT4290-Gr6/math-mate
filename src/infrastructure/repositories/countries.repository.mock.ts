import { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import { CountryInsert, Country } from '@/entities/models/country';

/**
 * Mock implementation of `ICountriesRepository` for testing purposes.
 *
 * Stores countries in memory instead of persisting to a real database.
 * Useful for unit tests or development environments.
 */
export class MockCountriesRepository implements ICountriesRepository {
    private _countries: Country[];

    constructor() {
        this._countries = [];
    }

    /**
     * Creates a new country and stores it in memory.
     * Automatically assigns a numeric ID.
     *
     * @param country - The country data to insert.
     * @returns The created `Country` object with assigned ID.
     */
    async createCountry(country: CountryInsert): Promise<Country> {
        const id = this._countries.length + 1;
        const created = { id, ...country };
        this._countries.push(created);
        return created;
    }

    /**
     * Retrieves all countries stored in memory.
     *
     * @returns An array of `Country` objects.
     */
    async getAllCountries(): Promise<Country[]> {
        return this._countries;
    }

    /**
     * Retrieves a country by its ID.
     *
     * @param id - The numeric ID of the country.
     * @returns The `Country` object if found, otherwise `null`.
     */
    async getCountryById(id: number): Promise<Country | null> {
        const country = this._countries.find((c) => c.id === id);
        return country || null;
    }

    /**
     * Clears the in-memory countries store.
     *
     * Useful for resetting state between tests or re-seeding mock data.
     */
    reset(): void {
        this._countries = [];
    }
}
