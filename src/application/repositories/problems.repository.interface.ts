import type { Problem } from '@/entities/models/problem';

export interface IProblemsRepository {
    getProblems(
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]>;
}
