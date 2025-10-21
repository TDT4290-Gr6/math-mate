import { getInjection } from '@/di/container';
import { expect, it, describe } from 'vitest';

const getProblemUseCase = getInjection('IGetProblemUseCase');

describe('getProblemUseCase', () => {
    describe('successful problem retrieval', () => {
        it('returns problem by id', async () => {
            const result = await getProblemUseCase(1);

            expect(result).toMatchObject({
                id: 1,
                title: 'Quadratic Equation',
                problem: 'Solve for x: 2x² + 5x - 3 = 0',
                solution: 'x = 0.5 or x = -3',
                subject: 'Algebra',
                level: 2,
                methods: [],
            });
        });
    });

    describe('data structure validation', () => {
        it('returns problem with correct data types', async () => {
            const result = await getProblemUseCase(1);

            expect(typeof result.id).toBe('number');
            expect(typeof result.title).toBe('string');
            expect(typeof result.problem).toBe('string');
            expect(typeof result.solution).toBe('string');
            expect(typeof result.subject).toBe('string');
            expect(typeof result.level).toBe('number');
            expect(Array.isArray(result.methods)).toBe(true);
        });

        it('returns problem with all required fields', async () => {
            const result = await getProblemUseCase(2);

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('title');
            expect(result).toHaveProperty('problem');
            expect(result).toHaveProperty('solution');
            expect(result).toHaveProperty('subject');
            expect(result).toHaveProperty('level');
            expect(result).toHaveProperty('methods');
        });
    });
});
