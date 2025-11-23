import type { IProblemsRepository } from '../repositories/problems.repository.interface';
import type { Problem } from '@/entities/models/problem';

export type IGetProblemsUseCase = ReturnType<typeof getProblemsUseCase>;

/**
 * Creates the `getProblemsUseCase` function.
 *
 * This use case is responsible for retrieving a list of problems
 * from the provided problems repository with optional filtering
 * by subjects and pagination.
 *
 * @param problemRepository - An implementation of `IProblemsRepository` used to fetch problems.
 * @returns A function that fetches problems based on offset, limit, user ID, user score, and optional subjects.
 *
 * @example
 * const getProblems = getProblemsUseCase(problemsRepository);
 * const problems = await getProblems(0, 10, 123, 50, ['algebra', 'geometry']);
 */
export const getProblemsUseCase =
    (problemRepository: IProblemsRepository) =>
    async (
        offset: number,
        limit: number,
        userId: number,
        userScore: number,
        subjects?: string[],
    ): Promise<Problem[]> => {
        return await problemRepository.getProblems(
            offset,
            limit,
            userId,
            userScore,
            subjects,
        );
    };
