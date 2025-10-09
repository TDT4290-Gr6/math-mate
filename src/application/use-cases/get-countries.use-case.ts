import { ICountriesRepository } from '../repositories/countries.repository.interface';

export type IGetCountriesUseCase = ReturnType<typeof getCountriesUseCase>;

export const getCountriesUseCase =
    (countryRepository: ICountriesRepository) => async () => {
        return countryRepository.getAllCountries();
    };
