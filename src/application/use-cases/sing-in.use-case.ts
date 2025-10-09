import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '@/entities/models/user';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
    (userRepository: IUsersRepository) =>
    async (uuid: string): Promise<User> => {
        // apparently not really a uuid but the id passed from next-auth

        const existingUser = await userRepository.getUserByUuid(uuid);

        if (existingUser) {
            return existingUser;
        }

        return await userRepository.createUser({ uuid, country: 1 });
    };
