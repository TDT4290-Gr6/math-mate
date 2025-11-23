import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '@/entities/models/user';

export type ICreateUserUseCase = ReturnType<typeof createUserUseCase>;

/**
 * Creates the `createUserUseCase` function.
 *
 * This use case is responsible for creating a new user
 * in the provided users repository.
 *
 * @param userRepository - An implementation of `IUsersRepository` used to persist users.
 * @returns A function that takes a UUID (or external ID from NextAuth) and creates a new `User`.
 *
 * @example
 * const createUser = createUserUseCase(usersRepository);
 * const newUser = await createUser("12345-uuid-from-nextauth");
 */
export const createUserUseCase =
    (userRepository: IUsersRepository) =>
    async (uuid: string): Promise<User> => {
        // apparently not really a uuid but the id passed from next-auth

        return await userRepository.createUser({ uuid });
    };
