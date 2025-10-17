import type { Problem } from '@/entities/models/problem';

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
