import { Solve } from '@/entities/models/solve';

/**
 * Formats a single `Solve` entity for presentation purposes.
 *
 * @param solve - The `Solve` object to be presented.
 * @returns An object containing the key properties of the solve, suitable for returning to clients or APIs.
 *
 * @example
 * const solve = {
 *   id: 1,
 *   userId: 10,
 *   problemId: 5,
 *   attempts: 2,
 *   startedSolvingAt: new Date(),
 *   stepsUsed: 3,
 *   finishedSolvingAt: new Date(),
 *   feedback: 4,
 *   wasCorrect: true,
 *   problemTitle: 'Example problem'
 * };
 * const presented = solvePresenter(solve);
 * // presented: {
 * //   id: 1,
 * //   userId: 10,
 * //   problemId: 5,
 * //   attempts: 2,
 * //   startedSolvingAt: ...,
 * //   stepsUsed: 3,
 * //   finishedSolvingAt: ...,
 * //   feedback: 4,
 * //   wasCorrect: true
 * // }
 */
export function solvePresenter(solve: Solve) {
    return {
        id: solve.id,
        userId: solve.userId,
        problemId: solve.problemId,
        attempts: solve.attempts,
        startedSolvingAt: solve.startedSolvingAt,
        stepsUsed: solve.stepsUsed,
        finishedSolvingAt: solve.finishedSolvingAt,
        feedback: solve.feedback,
        wasCorrect: solve.wasCorrect,
    };
}
