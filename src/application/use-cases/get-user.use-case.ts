import { IUsersRepository } from '../repositories/users.repository.interface';

export type IGetUserUseCase = ReturnType<typeof getUserUseCase>;

export const getUserUseCase =
    (userRepository: IUsersRepository) => async (id: number) => {
        return userRepository.getUserById(id);
    };
