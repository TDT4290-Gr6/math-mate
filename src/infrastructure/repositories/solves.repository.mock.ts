import { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { Solve, SolveInsert } from '@/entities/models/solve';

export class MockSolvesRepository implements ISolvesRepository {
    private _solves: Solve[];

    constructor() {
        this._solves = [];
    }

    async getById(id: number): Promise<Solve | null> {
        const solve = this._solves.find((s) => s.id === id);
        return solve ?? null;
    }

    async getByUserId(userId: number): Promise<Solve[]> {
        return this._solves.filter((s) => s.userId === userId);
    }

    async getLatestByUserId(userId: number): Promise<Solve[]> {
        const userSolves = this._solves.filter(
            (s) => s.userId === userId && s.finishedSolvingAt,
        );
        userSolves.sort((a, b) => {
            return (
                // We know finishedSolvingAt is defined due to the filter
                b.finishedSolvingAt!.getTime() - a.finishedSolvingAt!.getTime()
            );
        });

        // Return max 1 of each problem
        const uniqueSolvesMap = new Map<number, Solve>();
        for (const solve of userSolves)
            if (!uniqueSolvesMap.has(solve.problemId))
                uniqueSolvesMap.set(solve.problemId, solve);

        return Array.from(uniqueSolvesMap.values());
    }

    async getByProblemId(problemId: number): Promise<Solve[]> {
        return this._solves.filter((s) => s.problemId === problemId);
    }

    async getAttemptCount(userId: number, problemId: number): Promise<number> {
        const solves = this._solves.filter(
            (s) => s.userId === userId && s.problemId === problemId,
        );
        return solves.length;
    }

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

    async updateSolve(id: number, solve: Partial<SolveInsert>): Promise<Solve> {
        const existing = this._solves.find((s) => s.id === id);
        if (!existing) {
            throw new DatabaseOperationError(`Solve with id ${id} not found.`);
        }
        const updated: Solve = {
            ...existing,
            ...solve,
        } as Solve;
        const index = this._solves.findIndex((s) => s.id === id);
        this._solves[index] = updated;
        return updated;
    }

    async deleteSolve(id: number): Promise<Solve> {
        const index = this._solves.findIndex((s) => s.id === id);
        if (index === -1) {
            throw new DatabaseOperationError(`Solve with id ${id} not found.`);
        }
        const [deleted] = this._solves.splice(index, 1);
        return deleted;
    }
}
