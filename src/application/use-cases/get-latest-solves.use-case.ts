import { ISolvesRepository } from '../repositories/solves.repository.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { InputParseError } from '@/entities/errors/common';

export type IGetLatestSolvesUseCase = ReturnType<typeof getLatestSolvesUseCase>;

/**
 * Creates a use case that retrieves the latest solves for a given user.
 *
 * The use case is another function, and is supposed to be handled by injection.
 *
 * The inner async function takes a `userId` as input, verifies that the user exists,
 * and then retrieves the latest solves associated with that user from the solves repository.
 * If the user does not exist, it throws an `InputParseError`.
 *
 * @param userId - The ID of the user whose latest solves are to be retrieved.
 * @returns A list of the latest solves for the specified user.
 * @throws {InputParseError} If no user with the provided id exists.
 */
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
