import type { Problem } from '@/entities/models/problem';

/**
 * Interface for accessing and retrieving problem data from a repository.
 */
export interface IProblemsRepository {
    /**
     * Retrieves a list of problems with optional filtering and pagination.
     *
     * @param offset - The number of problems to skip (for pagination).
     * @param limit - The maximum number of problems to return.
     * @param userId - The ID of the user requesting the problems (for personalized filtering or tracking).
     * @param score - User score or difficulty level to filter problems.
     * @param subjects - Optional array of subject strings to filter problems by subject.
     * @returns A promise that resolves to an array of Problem objects.
     */
    getProblems(
        offset: number,
        limit: number,
        userId: number,
        score: number,
        subjects?: string[],
    ): Promise<Problem[]>;

    /**
     * Retrieves a single problem by its unique ID.
     *
     * @param id - The unique identifier of the problem.
     * @returns A promise that resolves to the Problem object.
     */
    getProblemById(id: number): Promise<Problem>;
}
