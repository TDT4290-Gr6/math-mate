import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const getProblemsUseCase = getInjection('IGetProblemsUseCase');

describe('getProblemsUseCase', () => {
    describe('basic problem retrieval', () => {
        it('returns problems with pagination', async () => {
            const result = await getProblemsUseCase(0, 2, 1, 0);

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: 1,
                title: 'Quadratic Equation',
                subject: 'Algebra',
                level: 2,
            });
            expect(result[1]).toMatchObject({
                id: 2,
                title: 'Right Triangle',
                subject: 'Geometry',
                level: 1,
            });
        });

        it('returns empty array when offset is beyond available problems', async () => {
            const result = await getProblemsUseCase(10, 5, 1, 0);
            expect(result).toHaveLength(0);
        });
    });

    describe('score-based filtering', () => {
        it('filters problems by user score level', async () => {
            // User with score 2 should only see problems with level >= 2
            const result = await getProblemsUseCase(0, 10, 1, 2);

            expect(result).toHaveLength(3);
            expect(result.map((problem) => problem.id)).toEqual([1, 3, 5]);
            expect(result.every((problem) => problem.level >= 2)).toBe(true);
        });

        it('returns no problems for user with very high score', async () => {
            const result = await getProblemsUseCase(0, 10, 1, 10);

            expect(result).toHaveLength(0);
        });
    });

    describe('subject-based filtering', () => {
        it('filters problems by single subject', async () => {
            const result = await getProblemsUseCase(0, 10, 1, 0, ['Geometry']);

            expect(result).toHaveLength(2);
            expect(result.map((problem) => problem.id)).toEqual([2, 5]);
            expect(
                result.every((problem) => problem.subject === 'Geometry'),
            ).toBe(true);
        });

        it('filters problems by multiple subjects', async () => {
            const result = await getProblemsUseCase(0, 10, 1, 0, [
                'Algebra',
                'Precalculus',
            ]);

            expect(result).toHaveLength(2);
            expect(result.map((problem) => problem.id)).toEqual([1, 3]);
            expect(
                result.every((problem) =>
                    ['Algebra', 'Precalculus'].includes(problem.subject),
                ),
            ).toBe(true);
        });

        it('returns empty array for non-existent subject', async () => {
            const result = await getProblemsUseCase(0, 10, 1, 0, ['Biology']);

            expect(result).toHaveLength(0);
        });
    });

    describe('solved problems filtering', () => {
        it('filters out solved problems for user 1', async () => {
            // User with id 1 has solved problems 4 and 6
            const result = await getProblemsUseCase(0, 10, 1, 0);

            expect(result).toHaveLength(4);
            expect(result.map((problem) => problem.id)).toEqual([1, 2, 3, 5]);
            expect(
                result.every((problem) => ![4, 6].includes(problem.id)),
            ).toBe(true);
        });

        it('returns all problems for user with no solved problems', async () => {
            const result = await getProblemsUseCase(0, 10, 2, 0);

            expect(result).toHaveLength(6);
            expect(result.map((problem) => problem.id)).toEqual([
                1, 2, 3, 4, 5, 6,
            ]);
        });
    });

    describe('data structure validation', () => {
        it('returns problems with correct data types', async () => {
            const result = await getProblemsUseCase(0, 1, 1, 0);

            expect(result).toHaveLength(1);
            const problem = result[0];

            expect(typeof problem.id).toBe('number');
            expect(typeof problem.title).toBe('string');
            expect(typeof problem.problem).toBe('string');
            expect(typeof problem.solution).toBe('string');
            expect(typeof problem.subject).toBe('string');
            expect(typeof problem.level).toBe('number');
            expect(Array.isArray(problem.methods)).toBe(true);
        });

        it('returns problems with all required fields', async () => {
            const result = await getProblemsUseCase(0, 1, 1, 0);

            expect(result).toHaveLength(1);
            const problem = result[0];

            expect(problem).toHaveProperty('id');
            expect(problem).toHaveProperty('title');
            expect(problem).toHaveProperty('problem');
            expect(problem).toHaveProperty('solution');
            expect(problem).toHaveProperty('subject');
            expect(problem).toHaveProperty('level');
            expect(problem).toHaveProperty('methods');
        });
    });
});
