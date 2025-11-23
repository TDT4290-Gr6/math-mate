import { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { Solve, SolveInsert } from '@/entities/models/solve';
/**
 * Mock implementation of the `ISolvesRepository` interface.
 *
 * Provides an in-memory store for solves, useful for testing or development
 * without a real database. Supports CRUD operations and user-specific queries.
 */
export class MockSolvesRepository implements ISolvesRepository {
    private _solves: Solve[];

    constructor() {
        this._solves = [];
    }

    /**
     * Retrieves a solve by its ID.
     * @param id - ID of the solve to retrieve.
     * @returns The solve or null if not found.
     */
    async getById(id: number): Promise<Solve | null> {
        const solve = this._solves.find((s) => s.id === id);
        return solve ?? null;
    }

    /**
     * Retrieves all solves for a given user.
     * @param userId - ID of the user.
     * @returns Array of solves for the user.
     */
    async getByUserId(userId: number): Promise<Solve[]> {
        return this._solves.filter((s) => s.userId === userId);
    }

    /**
     * Retrieves the latest solve for each problem for a user.
     * @param userId - ID of the user.
     * @returns Array of the most recent solves, one per problem.
     */
    async getLatestByUserId(userId: number): Promise<Solve[]> {
        const userSolves = this._solves.filter(
            (s) => s.userId === userId && s.finishedSolvingAt,
        );
        userSolves.sort(
            (a, b) =>
                b.finishedSolvingAt!.getTime() - a.finishedSolvingAt!.getTime(),
        );

        const uniqueSolvesMap = new Map<number, Solve>();
        for (const solve of userSolves) {
            if (!uniqueSolvesMap.has(solve.problemId))
                uniqueSolvesMap.set(solve.problemId, solve);
        }

        return Array.from(uniqueSolvesMap.values());
    }

    /**
     * Retrieves all solves for a given problem.
     * @param problemId - ID of the problem.
     * @returns Array of solves for the problem.
     */
    async getByProblemId(problemId: number): Promise<Solve[]> {
        return this._solves.filter((s) => s.problemId === problemId);
    }

    /**
     * Counts how many attempts a user has made for a specific problem.
     * @param userId - ID of the user.
     * @param problemId - ID of the problem.
     * @returns Number of attempts.
     */
    async getAttemptCount(userId: number, problemId: number): Promise<number> {
        return this._solves.filter(
            (s) => s.userId === userId && s.problemId === problemId,
        ).length;
    }

    /**
     * Creates a new solve entry.
     * @param solve - Data for the new solve.
     * @returns The newly created solve with an auto-incremented ID and attempt count.
     */
    async createSolve(solve: SolveInsert): Promise<Solve> {
        const attemptsUsed = await this.getAttemptCount(
            solve.userId,
            solve.problemId,
        );
        const newSolve = {
            id: this._solves.length + 1,
            attempts: attemptsUsed + 1,
            ...solve,
        };
        this._solves.push(newSolve);
        return newSolve;
    }

    /**
     * Updates an existing solve entry.
     * @param id - ID of the solve to update.
     * @param solve - Partial solve data to update.
     * @returns The updated solve.
     * @throws DatabaseOperationError if the solve is not found.
     */
    async updateSolve(id: number, solve: Partial<SolveInsert>): Promise<Solve> {
        const existing = this._solves.find((s) => s.id === id);
        if (!existing)
            throw new DatabaseOperationError(`Solve with id ${id} not found.`);
        const updated: Solve = { ...existing, ...solve } as Solve;
        const index = this._solves.findIndex((s) => s.id === id);
        this._solves[index] = updated;
        return updated;
    }

    /**
     * Deletes a solve by its ID.
     * @param id - ID of the solve to delete.
     * @returns The deleted solve.
     * @throws DatabaseOperationError if the solve is not found.
     */
    async deleteSolve(id: number): Promise<Solve> {
        const index = this._solves.findIndex((s) => s.id === id);
        if (index === -1)
            throw new DatabaseOperationError(`Solve with id ${id} not found.`);
        const [deleted] = this._solves.splice(index, 1);
        return deleted;
    }
}
