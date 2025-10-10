import { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';

export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[];

    constructor() {
        this._problems = [];
    }

    async getProblems(): Promise<Problem[]> {
        return this._problems;
    }
}
