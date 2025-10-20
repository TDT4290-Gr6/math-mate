import type { Problem } from '@/entities/models/problem';

export interface IProblemsRepository {
    getProblems(
        offset: number,
        limit: number,
        userId: number,
        score: number,
        subjects?: string[],
    ): Promise<Problem[]>;
    getProblemById(id: number): Promise<Problem>;
}
