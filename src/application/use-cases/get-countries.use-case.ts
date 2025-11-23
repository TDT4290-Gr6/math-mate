import { ICountriesRepository } from '../repositories/countries.repository.interface';

export type IGetCountriesUseCase = ReturnType<typeof getCountriesUseCase>;

/**
 * Creates the `getCountriesUseCase` function.
 *
 * This use case is responsible for retrieving all countries
 * from the provided countries repository.
 *
 * @param countryRepository - An implementation of `ICountriesRepository` used to fetch countries.
 * @returns A function that returns a list of all `Country` objects.
 *
 * @example
 * const getCountries = getCountriesUseCase(countriesRepository);
 * const countries = await getCountries();
 */
export const getCountriesUseCase =
    (countryRepository: ICountriesRepository) => async () => {
        return countryRepository.getAllCountries();
    };
