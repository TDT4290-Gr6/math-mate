import { Solve, SolveInsert } from '@/entities/models/solve';

export interface ISolvesRepository {
    getById(id: number): Promise<Solve | null>;
    getByUserId(userId: number): Promise<Solve[]>;
    getLatestByUserId(userId: number): Promise<Solve[]>;
    getByProblemId(problemId: number): Promise<Solve[]>;
    getAttemptCount(userId: number, problemId: number): Promise<number>;
    createSolve(solve: SolveInsert): Promise<Solve>;
    updateSolve(id: number, solve: Partial<SolveInsert>): Promise<Solve>;
    deleteSolve(id: number): Promise<Solve>;
}
