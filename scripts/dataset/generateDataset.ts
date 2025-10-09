import { Problem, LLMProviderType, DatasetEntry } from './types';
import { generateMethods } from './generateMethods';
import { open as openPromise } from 'fs/promises';
import { prisma } from '@/lib/prisma';

/**
 * Asynchronously loads a dataset from a file, where each line is a JSON-encoded entry.
 *
 * @remarks
 * Assumes that each JSON line in the file corresponds to a single `DatasetEntry` object.
 *
 * @param filePath - The path to the dataset file to read.
 * @returns A promise that resolves to an array of `DatasetEntry` objects parsed from the file.
 *
 * @throws Will propagate any errors encountered during file access or JSON parsing.
 */
async function loadDataset(filePath: string): Promise<DatasetEntry[]> {
    const dataset: DatasetEntry[] = [];
    const file = await openPromise(filePath, 'r');

    for await (const line of file.readLines()) {
        if (line.trim()) dataset.push(JSON.parse(line));
    }
    file.close();
    return dataset;
}

/**
 * Converts an array of `DatasetEntry` objects into an array of `Problem` objects.
 *
 * Each `Problem` object is constructed using properties from the corresponding `DatasetEntry`,
 * including a generated title, solution, level, problem statement, subject, and an empty methods array.
 *
 * @param dataset - The array of `DatasetEntry` objects to convert.
 * @returns An array of `Problem` objects derived from the input dataset.
 */
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

/**
 * Asynchronously loads a dataset from a specified JSONL file and converts it into an array of `Problem` objects.
 *
 * @returns A promise that resolves to an array of `Problem` instances.
 */
async function getProblems(): Promise<Problem[]> {
    const dataset = await loadDataset('MATH-500/test.jsonl');
    return datasetToProblems(dataset);
}

/**
 * Main function to generate and store math problems in the database.
 *
 * - Retrieves a list of problems using `getProblems()`.
 * - For each problem, checks if it already exists in the database.
 * - If the problem does not exist, generates a title and solution methods using an LLM provider.
 * - Saves the new problem, its generated title, methods, and steps to the database.
 * - Logs progress and results to the console.
 *
 * @returns Resolves when all problems have been processed and stored.
 */
async function main() {
    const problems = await getProblems();
    const llmProvider = LLMProviderType.GEMINI;

    for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        console.log(
            `Generating title and methods for problem number: ${i + 1}`,
        );

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

        // Save to database
        // Prisma/supabase handles nested creates with references
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
