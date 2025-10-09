import { access, constants, open as openPromise } from 'fs/promises';
import { Problem, LLMProviderType, DatasetEntry } from './types';
import { generateMethods } from './generateMethods';

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
        difficulty: entry.level,
        description: entry.problem,
        problemID: entry.unique_id,
        topic: entry.subject,
        methods: [],
    }));
}

async function getProblems(): Promise<Problem[]> {
    try {
        await access('problems.json', constants.F_OK);
        const file = await openPromise('problems.json', 'r');
        const data = await file.readFile('utf-8');
        file.close();
        return JSON.parse(data);
    } catch {
        const dataset = await loadDataset('MATH-500/test.jsonl');
        return datasetToProblems(dataset);
    }
}

async function saveProblems(problems: Problem[]) {
    const file = await openPromise('problems.json', 'w');
    await file.writeFile(JSON.stringify(problems, null, 4), 'utf-8');
    file.close();
}

async function main() {
    const problems = await getProblems();
    const llmProvider = LLMProviderType.OPENAI;

    for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        console.log(`Generating methods for problem ID: ${problem.problemID}`);

        const updatedProblem = await generateMethods(problem, llmProvider);
        problems[i] = updatedProblem;

        await saveProblems(problems);
        console.log(
            `Done generating methods for problem ID: ${problem.problemID}`,
        );
    }
}

main();
