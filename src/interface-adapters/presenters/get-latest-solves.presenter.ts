import type { Solve } from '@/entities/models/solve';

export function getLatestSolvesPresenter(solves: Solve[]) {
    return solves.map((solve) => ({
        id: solve.id,
        problemId: solve.problemId,
        problemTitle: solve.problemTitle ?? 'Unknown problem title',
    }));
}
