import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import type { Problem } from '@/entities/models/problem';

export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[];

    constructor() {
        this._problems = [];
    }

    async getProblems(
        offset: number,
        limit: number,
        id: number,
        score: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        let filtered = this._problems;

        filtered = filtered.filter(
            (problem) => problem.level >= Math.floor(score),
        );

        if (subjects?.length) {
            filtered = filtered.filter((problem) =>
                subjects.includes(problem.subject),
            );
        }
        return filtered.slice(offset, offset + limit);
    }

    getProblemById(id: number): Promise<Problem> {
        const problem = this._problems.find((p) => p.id === id);
        if (!problem) {
            throw new Error(`Problem with id ${id} not found`);
        }
        return Promise.resolve(problem);
    }
}
