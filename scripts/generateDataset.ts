import { generateMethods } from './generateMethods';
import { open as openPromise } from 'fs/promises';
import { Problem } from './problem.entity';

interface DatasetEntry {
    problem: string;
    solution: string;
    answer: string;
    subject: string;
    level: number;
    unique_id: string;
}

async function loadDataset(filePath: string): Promise<DatasetEntry[]> {
    const dataset: DatasetEntry[] = [];
    const file = await openPromise(filePath, 'r');

    for await (const line of file.readLines()) {
        if (line.trim()) dataset.push(JSON.parse(line));
    }
    return dataset;
}

function datasetToProblems(dataset: DatasetEntry[]): Problem[] {
    return dataset.map((entry) => ({
        title: `Problem ${entry.unique_id}`,
        solution: entry.answer,
        difficulty: entry.level,
        description: entry.problem,
        problemID: entry.unique_id,
        topic: entry.subject,
        methods: [],
    }));
}

async function main() {
    const dataset = await loadDataset('MATH-500/test.jsonl');
    const problems = datasetToProblems(dataset);
    const problem = problems[2];

    generateMethods(problem).then((problem) => {
        console.dir(problem, { depth: null });
    });
}

main();
