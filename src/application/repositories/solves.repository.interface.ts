import { Solve, SolveInsert } from '@/entities/models/solve';

/**
 * Interface for managing user solves (problem-solving records) in a repository.
 */
export interface ISolvesRepository {
    /**
     * Retrieves a solve by its unique ID.
     *
     * @param id - The unique identifier of the solve.
     * @returns A promise that resolves to the Solve object, or null if not found.
     */
    getById(id: number): Promise<Solve | null>;

    /**
     * Retrieves all solves associated with a specific user.
     *
     * @param userId - The ID of the user.
     * @returns A promise that resolves to an array of Solve objects.
     */
    getByUserId(userId: number): Promise<Solve[]>;

    /**
     * Retrieves the latest solves for a specific user.
     *
     * @param userId - The ID of the user.
     * @returns A promise that resolves to an array of the most recent Solve objects.
     */
    getLatestByUserId(userId: number): Promise<Solve[]>;

    /**
     * Retrieves all solves for a specific problem.
     *
     * @param problemId - The ID of the problem.
     * @returns A promise that resolves to an array of Solve objects.
     */
    getByProblemId(problemId: number): Promise<Solve[]>;

    /**
     * Retrieves the number of attempts a user has made for a specific problem.
     *
     * @param userId - The ID of the user.
     * @param problemId - The ID of the problem.
     * @returns A promise that resolves to the number of attempts.
     */
    getAttemptCount(userId: number, problemId: number): Promise<number>;

    /**
     * Creates a new solve record.
     *
     * @param solve - The SolveInsert object containing solve details.
     * @returns A promise that resolves to the newly created Solve object.
     */
    createSolve(solve: SolveInsert): Promise<Solve>;

    /**
     * Updates an existing solve record.
     *
     * @param id - The ID of the solve to update.
     * @param solve - Partial data to update in the solve record.
     * @returns A promise that resolves to the updated Solve object.
     */
    updateSolve(id: number, solve: Partial<SolveInsert>): Promise<Solve>;

    /**
     * Deletes a solve record.
     *
     * @param id - The ID of the solve to delete.
     * @returns A promise that resolves to the deleted Solve object.
     */
    deleteSolve(id: number): Promise<Solve>;
}
