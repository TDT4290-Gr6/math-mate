import { ICountriesRepository } from '../repositories/countries.repository.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { InputParseError } from '@/entities/errors/common';
import { User } from '@/entities/models/user';

export type ISetCountryUseCase = ReturnType<typeof setCountryUseCase>;

/**
 * Factory function that creates the `setCountryUseCase`.
 *
 * This use case is responsible for assigning a country to a user. It performs
 * validation to ensure both the user and the country exist before updating
 * the user's record in the repository.
 *
 * @param userRepository - An implementation of `IUsersRepository` used to fetch and update users.
 * @param countriesRepository - An implementation of `ICountriesRepository` used to fetch countries.
 * @returns A function that takes a user ID and a country ID, validates them, and updates the user's country.
 *
 * @throws {InputParseError} Throws if the user or country does not exist.
 *
 * @example
 * const setCountry = setCountryUseCase(usersRepo, countriesRepo);
 * const updatedUser = await setCountry(1, 42);
 */
export const setCountryUseCase =
    (
        userRepository: IUsersRepository,
        countriesRepository: ICountriesRepository,
    ) =>
    async (id: number, countryId: number): Promise<User> => {
        const country = await countriesRepository.getCountryById(countryId); // ensure country exists
        if (!country) {
            throw new InputParseError('Country not found');
        }

        const user = await userRepository.getUserById(id); // ensure user exists
        if (!user) {
            throw new InputParseError('User not found');
        }

        return await userRepository.addCountryToUser(id, countryId);
    };
