import type { Problem } from '@/entities/models/problem';
import { problemPresenter } from './problem.presenter';

export function problemsPresenter(problems: Problem[]) {
    return problems.map(problemPresenter);
}
