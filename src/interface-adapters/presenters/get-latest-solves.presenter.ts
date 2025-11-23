import type { Solve } from '@/entities/models/solve';

/**
 * Formats an array of `Solve` entities to present only the latest solves with essential information.
 *
 * @param solves - An array of `Solve` objects to be presented.
 * @returns An array of objects containing the `id`, `problemId`, and `problemTitle` (or a default if missing) of each solve.
 *
 * @example
 * const solves = [
 *   { id: 1, problemId: 42, problemTitle: 'Quadratic Equation', ... },
 *   { id: 2, problemId: 17, problemTitle: undefined, ... }
 * ];
 * const result = getLatestSolvesPresenter(solves);
 * // result: [
 * //   { id: 1, problemId: 42, problemTitle: 'Quadratic Equation' },
 * //   { id: 2, problemId: 17, problemTitle: 'Unknown problem title' }
 * // ]
 */
export function getLatestSolvesPresenter(solves: Solve[]) {
    return solves.map((solve) => ({
        id: solve.id,
        problemId: solve.problemId,
        problemTitle: solve.problemTitle ?? 'Unknown problem title',
    }));
}
