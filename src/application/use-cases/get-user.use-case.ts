import { IUsersRepository } from '../repositories/users.repository.interface';

export type IGetUserUseCase = ReturnType<typeof getUserUseCase>;

/**
 * Factory function that creates the `getUserUseCase` function.
 *
 * This use case is responsible for retrieving a user by their ID
 * from the provided users repository.
 *
 * @param userRepository - An implementation of `IUsersRepository` used to fetch users.
 * @returns A function that takes a user ID and returns the corresponding user or null if not found.
 *
 * @example
 * const getUser = getUserUseCase(usersRepository);
 * const user = await getUser(123);
 */
export const getUserUseCase =
    (userRepository: IUsersRepository) => async (id: number) => {
        return userRepository.getUserById(id);
    };
