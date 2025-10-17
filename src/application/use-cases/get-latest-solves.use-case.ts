import { ISolvesRepository } from '../repositories/solves.repository.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { InputParseError } from '@/entities/errors/common';

export type IGetLatestSolvesUseCase = ReturnType<typeof getLatestSolvesUseCase>;

export const getLatestSolvesUseCase =
    (userRepository: IUsersRepository, solvesRepository: ISolvesRepository) =>
    async (userId: number) => {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new InputParseError('User not found');
        }

        const solves = await solvesRepository.getLatestByUserId(userId);

        return solves;
    };
