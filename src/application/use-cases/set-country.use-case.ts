import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { InputParseError } from '@/entities/errors/common';

export type ISetCountryUseCase = ReturnType<typeof setCountryUseCase>;

export const setCountryUseCase =
    (
        userRepository: IUsersRepository,
        countriesRepository: ICountriesRepository,
    ) =>
    async (id: number, countryId: number): Promise<void> => {
        const country = countriesRepository.getCountryById(countryId); // ensure country exists
        if (!country) {
            throw new InputParseError('Country not found');
        }

        const user = userRepository.getUserById(id); // ensure user exists
        if (!user) {
            throw new InputParseError('User not found');
        }

        userRepository.addCountryToUser(id, countryId);
    };
