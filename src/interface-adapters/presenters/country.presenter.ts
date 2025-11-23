import { Country } from '@/entities/models/country';

/**
 * Formats an array of `Country` entities for API responses or front-end consumption.
 *
 * @param countries - An array of `Country` objects to be presented.
 * @returns An array of plain objects containing only the `id` and `name` of each country.
 *
 * @example
 * const countries = [{ id: 1, name: "Germany" }, { id: 2, name: "France" }];
 * const result = countryPresenter(countries);
 * // result: [{ id: 1, name: "Germany" }, { id: 2, name: "France" }]
 */
export function countryPresenter(countries: Country[]) {
    return countries.map((country) => ({
        id: country.id,
        name: country.name,
    }));
}
