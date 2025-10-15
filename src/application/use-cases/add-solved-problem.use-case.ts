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
