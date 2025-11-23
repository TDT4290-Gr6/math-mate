import type { Problem } from '@/entities/models/problem';
import { problemPresenter } from './problem.presenter';

/**
 * Formats an array of `Problem` entities for presentation purposes.
 *
 * @param problems - An array of `Problem` objects to be presented.
 * @returns An array of formatted problem objects, using `problemPresenter` for each element.
 *
 * @example
 * const problems = [
 *   { id: 1, problem: '2+2', solution: '4', subject: 'Math', level: 1, methods: [], title: 'Addition' },
 *   { id: 2, problem: '3*3', solution: '9', subject: 'Math', level: 1, methods: [], title: 'Multiplication' }
 * ];
 * const presented = problemsPresenter(problems);
 * // presented: [
 * //   { id: 1, problem: '2+2', solution: '4', subject: 'Math', level: 1, methods: [], title: 'Addition' },
 * //   { id: 2, problem: '3*3', solution: '9', subject: 'Math', level: 1, methods: [], title: 'Multiplication' }
 * // ]
 */
export function problemsPresenter(problems: Problem[]) {
    return problems.map(problemPresenter);
}
