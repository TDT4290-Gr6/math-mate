import { Problem, LLMProviderType, DatasetEntry } from './types';
import { generateMethods } from './generateMethods';
import { open as openPromise } from 'fs/promises';
import { prisma } from '@/lib/prisma';

async function loadDataset(filePath: string): Promise<DatasetEntry[]> {
    const dataset: DatasetEntry[] = [];
    const file = await openPromise(filePath, 'r');

    for await (const line of file.readLines()) {
        if (line.trim()) dataset.push(JSON.parse(line));
    }
    file.close();
    return dataset;
}

function datasetToProblems(dataset: DatasetEntry[]): Problem[] {
    return dataset.map((entry) => ({
        title: `Problem ${entry.unique_id}`,
        solution: entry.answer,
        level: entry.level,
        problem: entry.problem,
        subject: entry.subject,
        methods: [],
    }));
}

async function getProblems(): Promise<Problem[]> {
    const dataset = await loadDataset('MATH-500/test.jsonl');
    return datasetToProblems(dataset);
}

async function main() {
    const problems = await getProblems();
    const llmProvider = LLMProviderType.GEMINI;

    for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        console.log(`Generating title and methods for problem number: ${i + 1}`);

        // Fetch and see if it already exists in the database
        const existingProblem = await prisma.problem.findUnique({
            where: { problem: problem.problem },
        });

        if (existingProblem !== null) {
            console.log(
                `Problem already exists in database, skipping problem number: ${i + 1}`,
            );
            continue;
        }

        const generated = await generateMethods(problem, llmProvider);

        console.log(
            `Done generating methods for problem number: ${i + 1}. Saving to database...`,
        );

        const response = await prisma.problem.create({
            data: {
                problem: problem.problem,
                solution: problem.solution,
                subject: problem.subject,
                level: problem.level,
                title: generated.title,
                Method: {
                    create: generated.methods.map((method) => ({
                        title: method.title,
                        description: method.description,
                        Step: {
                            create: method.steps.map((step, index) => ({
                                stepNumber: index + 1,
                                content: step,
                            })),
                        },
                    })),
                },
            },
        });

        console.dir(response, { depth: null });
        console.log(`Done saving problem number: ${i + 1} to database.`);
    }
}

main();
