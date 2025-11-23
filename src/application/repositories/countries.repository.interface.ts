import { Country, CountryInsert } from '@/entities/models/country';

/**
 * Interface for performing CRUD operations on country data.
 */
export interface ICountriesRepository {
    /**
     * Creates a new country record.
     *
     * @param country - The country data to insert.
     * @returns A promise that resolves to the newly created Country object.
     */
    createCountry(country: CountryInsert): Promise<Country>;

    /**
     * Retrieves all countries from the repository.
     *
     * @returns A promise that resolves to an array of Country objects.
     */
    getAllCountries(): Promise<Country[]>;

    /**
     * Retrieves a single country by its unique ID.
     *
     * @param id - The unique identifier of the country.
     * @returns A promise that resolves to the Country object, or null if not found.
     */
    getCountryById(id: number): Promise<Country | null>;
}
