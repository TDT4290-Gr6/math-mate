import { Problem } from '@/entities/models/problem';

export function problemPresenter(problems: Problem[]) {
    return problems.map((problem) => ({
        id: problem.id,
        problem: problem.problem,
        solution: problem.solution,
        subject: problem.subject,
        title: problem.title,
        methods: problem.methods
    }));
}
