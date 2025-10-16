import {
    DatabaseOperationError,
    InputParseError,
} from '@/entities/errors/common';
import { ISolvesRepository } from '../repositories/solves.repository.interface';
import { IUsersRepository } from '../repositories/users.repository.interface';
import { SolveInsert } from '@/entities/models/solve';

export type IAddSolvedProblemUseCase = ReturnType<
    typeof addSolvedProblemUseCase
>;
/**
 * Adds a solved problem for a user.
 *
 * This inner async function takes a `SolveInsert` input, verifies that the user exists,
 * and then attempts to create a new solve record in the solves repository.
 * If the user does not exist, it throws an `InputParseError`.
 * If the solve creation fails, it throws a `DatabaseOperationError` with the original error as the cause.
 *
 * @param input - The data required to insert a new solve, including the user ID and problem details.
 * @returns The created solve record.
 * @throws {InputParseError} If the user is not found.
 * @throws {DatabaseOperationError} If there is an error while creating the solve record.
 */
export const addSolvedProblemUseCase =
    (userRepository: IUsersRepository, solvesRepository: ISolvesRepository) =>
    async (input: SolveInsert) => {
        const user = await userRepository.getUserById(input.userId);
        if (!user) {
            throw new InputParseError('User not found');
        }

        try {
            const solve = await solvesRepository.createSolve(input);
            return solve;
        } catch (error) {
            throw new DatabaseOperationError(
                'Failed to add solved problem: ' + (error as Error).message,
                { cause: error as Error },
            );
        }
    };
