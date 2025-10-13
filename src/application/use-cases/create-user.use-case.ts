import { IUsersRepository } from '../repositories/users.repository.interface';
import { User } from '@/entities/models/user';

export type ICreateUserUseCase = ReturnType<typeof createUserUseCase>;

export const createUserUseCase =
    (userRepository: IUsersRepository) =>
    async (uuid: string): Promise<User> => {
        // apparently not really a uuid but the id passed from next-auth

        return await userRepository.createUser({ uuid });
    };
