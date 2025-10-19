import { Solve } from '@/entities/models/solve';

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
