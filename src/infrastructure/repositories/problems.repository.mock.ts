import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import type { Problem } from '@/entities/models/problem';
import { Solve } from '@/entities/models/solve';

export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[] = [
        {
            id: 1,
            title: 'Quadratic Equation',
            problem: 'Solve for x: 2x² + 5x - 3 = 0',
            solution: 'x = 0.5 or x = -3',
            subject: 'Algebra',
            level: 2,
            methods: [],
        },
        {
            id: 2,
            title: 'Right Triangle',
            problem:
                'Find the length of the hypotenuse of a right triangle with legs of length 3 and 4.',
            solution: '5',
            subject: 'Geometry',
            level: 1,
            methods: [],
        },
        {
            id: 3,
            title: 'Derivative of Polynomial',
            problem: 'Find the derivative of f(x) = 3x³ - 2x² + 5x - 1',
            solution: "9x² - 4x + 5",
            subject: 'Precalculus',
            level: 3,
            methods: [],
        },
        {
            id: 4,
            problem: 'What is the sum of angles in a triangle?',
            solution: '180 degrees',
            subject: 'Geometry',
            level: 1,
            methods: [],
        },
    ];

    private _solves: Solve[] = [
        {
            id: 1,
            userId: 1,
            problemId: 4,
            attempts: 2,
            startedSolvingAt: new Date('2025-10-15T10:30:00Z'),
            stepsUsed: 5,
            finishedSolvingAt: new Date('2025-10-15T10:45:00Z'),
            feedback: 4,
            wasCorrect: true,
            problemTitle: 'What is the sum of angles in a triangle?',
        },
        {
            id: 2,
            userId: 1,
            problemId: 3,
            attempts: 1,
            startedSolvingAt: new Date('2025-10-20T14:20:00Z'),
            stepsUsed: 3,
            finishedSolvingAt: undefined, 
            feedback: undefined,
            wasCorrect: undefined,
            problemTitle: 'Derivative of Polynomial',
        },
    ];
    
    async getProblems(
        offset: number,
        limit: number,
        id: number,
        score: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        const solvedProblemIds = this._solves
            .filter((s) => s.userId === id)
            .map((s) => s.problemId);

        let filtered = this._problems.filter(
            (problem) => problem.level >= Math.floor(score),
        );

        if (subjects?.length) {
            filtered = filtered.filter((problem) =>
                subjects.includes(problem.subject),
            );
        }

        if (solvedProblemIds.length > 0) {
            filtered = filtered.filter(
                (problem) => !solvedProblemIds.includes(problem.id),
            );
        }

        filtered.sort((a, b) => a.id - b.id);

        return filtered.slice(offset, offset + limit);
    }

    getProblemById(id: number): Promise<Problem> {
        const problem = this._problems.find((problem) => problem.id === id);
        if (!problem) {
            throw new Error(`Problem with id ${id} not found.`);
        }
        return Promise.resolve(problem);
    }
}
