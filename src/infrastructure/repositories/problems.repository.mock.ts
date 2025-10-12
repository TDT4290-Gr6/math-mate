import { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';

export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[];

    constructor() {
        this._problems = [];
    }

    async getProblems(
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        let filtered = this._problems;

        if (subjects?.length) {
            filtered = filtered.filter((problem) => subjects.includes(problem.subject));
        }
        return filtered.slice(offset, offset + limit);
    }
}
