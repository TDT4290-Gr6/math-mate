import type { Problem } from '@/entities/models/problem';

/**
 * Formats a single `Problem` entity for presentation purposes.
 *
 * @param problem - The `Problem` object to be presented.
 * @returns An object containing key properties of the problem: `id`, `problem`, `solution`, `subject`, `level`, `methods`, and `title`.
 *
 */
export function problemPresenter(problem: Problem) {
    return {
        id: problem.id,
        problem: problem.problem,
        solution: problem.solution,
        subject: problem.subject,
        level: problem.level,
        methods: problem.methods,
        title: problem.title,
    };
}
