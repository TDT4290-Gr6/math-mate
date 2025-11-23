import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '@/entities/models/user';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

/**
 * Factory function that creates the `signInUseCase`.
 *
 * This use case handles user sign-in by checking if a user with the given
 * UUID (or external ID from NextAuth) already exists. If the user exists,
 * it returns the existing user; otherwise, it creates a new user in the repository.
 *
 * @param userRepository - An implementation of `IUsersRepository` used to fetch and persist users.
 * @returns A function that takes a UUID string and returns the corresponding `User`.
 *
 * @example
 * const signIn = signInUseCase(usersRepository);
 * const user = await signIn("12345-uuid-from-nextauth");
 */
export const signInUseCase =
    (userRepository: IUsersRepository) =>
    async (uuid: string): Promise<User> => {
        // apparently not really a uuid but the id passed from next-auth

        const existingUser = await userRepository.getUserByUuid(uuid);

        if (existingUser) {
            return existingUser;
        }

        return await userRepository.createUser({ uuid });
    };
