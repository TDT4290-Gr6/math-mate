import { IProblemsRepository } from '../repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';

export type IGetProblemUseCase = ReturnType<typeof getProblemUseCase>;

/**
 * Creates the `getProblemUseCase` function.
 *
 * This use case is responsible for retrieving a single problem by its ID
 * from the provided problems repository.
 *
 * @param problemRepository - An implementation of `IProblemsRepository` used to fetch problems.
 * @returns A function that takes a problem ID and returns the corresponding `Problem`.
 *
 * @example
 * const getProblem = getProblemUseCase(problemsRepository);
 * const problem = await getProblem(123);
 */
export const getProblemUseCase =
    (problemRepository: IProblemsRepository) =>
    async (problemId: number): Promise<Problem> => {
        return await problemRepository.getProblemById(problemId);
    };
