import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import type { Problem } from '@/entities/models/problem';

export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[];

    constructor() {
        this._problems = [];
    }
    getProblemById(id: number): Promise<Problem> {
        throw new Error('Method not implemented.');
    }

    async getProblems(
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        let filtered = this._problems;

        if (subjects?.length) {
            filtered = filtered.filter((problem) =>
                subjects.includes(problem.subject),
            );
        }
        return filtered.slice(offset, offset + limit);
    }
}
