import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import type { Problem } from '@/entities/models/problem';
import type { Solve } from '@/entities/models/solve';
/**
 * Mock implementation of the `IProblemsRepository` interface.
 *
 * Provides an in-memory collection of problems and solved problem tracking,
 * useful for testing or development without a real database.
 */
export class MockProblemsRepository implements IProblemsRepository {
    private _problems: Problem[];
    private _solves: Solve[] = [];

    constructor() {
        // Initialize with some sample problems
        this._problems = [
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
                solution: '9x² - 4x + 5',
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
            {
                id: 5,
                problem:
                    'Find the area of a rectangle with length 8 cm and width 3 cm.',
                solution: '24 cm²',
                subject: 'Geometry',
                level: 2,
                methods: [],
            },
            {
                id: 6,
                problem: 'Solve for x: 2x + 5 = 13',
                solution: 'x = 4',
                subject: 'Algebra',
                level: 1,
                methods: [],
            },
        ];

        // Sample solves
        this._solves = [
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
                problemId: 6,
                attempts: 1,
                startedSolvingAt: new Date('2025-10-15T14:20:00Z'),
                stepsUsed: 3,
                finishedSolvingAt: new Date('2025-10-15T14:30:00Z'),
                feedback: 3,
                wasCorrect: false,
                problemTitle: 'Derivative of Polynomial',
            },
        ];
    }

    /**
     * Returns a filtered list of problems for a user, considering score, subjects, and previously solved problems.
     *
     * @param offset - Number of items to skip.
     * @param limit - Maximum number of problems to return.
     * @param userId - The user requesting problems.
     * @param score - Minimum user score to filter problems by difficulty.
     * @param subjects - Optional list of subjects to filter problems.
     * @returns A promise resolving to an array of `Problem` objects.
     */
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

    /**
     * Retrieves a single problem by its ID.
     *
     * @param id - The ID of the problem to retrieve.
     * @returns A promise resolving to the `Problem`.
     * @throws {DatabaseOperationError} If the problem is not found.
     */
    async getProblemById(id: number): Promise<Problem> {
        const problem = this._problems.find((problem) => problem.id === id);
        if (!problem) {
            throw new DatabaseOperationError(
                `Problem with id ${id} not found.`,
            );
        }
        return problem;
    }
}
