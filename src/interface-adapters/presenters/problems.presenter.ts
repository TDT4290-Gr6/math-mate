import { Problem } from "@/entities/models/problem";

export function problemsPresenter(problems: Problem[]) {
    return problems.map((problem) => ({
        id: problem.id,
        problem: problem.problem,
        solution: problem.solution,
        subject: problem.subject,
        level: problem.level,
        methods: problem.methods,
        title: problem.title,
    }));
}