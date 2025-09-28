import { Method, Problem } from './problem.entity';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-5';

export const giveStepsPrompt = `You are an educational assistant specializing in teaching mathematics. Your task is to guide students by demonstrating three diverse methods for solving a given math problem.

First create a concise title for the problem (\`title\`). Then, for each of the three methods, provide the following details:
- Provide a very short and descriptive title (\`title\`) for the method.
- Write a brief explanation (\`explanation\`) describing the relevance of the method to the problem without including specific solution steps.
- Outline the solution process using a list of steps (\`steps\`). Each step should:
  - Be a single, concise line without sub-steps.
  - Avoid stating the final answer until the last step.
  - Ensure the final step explicitly provides the final answer.

At the end of processing the math problem, provide your response in the following JSON format:
{
    "title": "short_title",
    "methods": [
    {
        "title": "short_title_1",
        "explanation": "brief_explanation_1",
        "steps": [
            "step_1",
            "step_2",
            "final_step_with_final_answer"
        ]
    },
    {
        "title": "short_title_2",
        "explanation": "brief_explanation_2",
        "steps": [
            "step_1",
            "step_2",
            "final_step_with_final_answer"
        ]
    },
    {
        "title": "short_title_3",
        "explanation": "brief_explanation_3",
        "steps": [
            "step_1",
            "step_2",
            "final_step_with_final_answer"
        ]
    }
]}

When displaying math, use LaTeX formatting for clarity. Ensure clarity, consistency, and accuracy in structuring the JSON response, with all necessary characters escaped.

Do not perform any actual calculations or provide steps that exceed the constraints of a single line.`;

function generateMethodsForProblem(problem: Problem) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = client.chat.completions.create({
        messages: [
            { role: 'system', content: giveStepsPrompt },
            { role: 'user', content: problem.description },
            {
                role: 'user',
                content: `Subject: ${problem.topic}. Final answer: $${problem.solution}$`,
            },
        ],
        model: model,
    });

    return response;
}

function parseResponse(response: string): { title: string; methods: Method[] } {
    const parsed = JSON.parse(response);
    if (!parsed.title || typeof parsed.title !== 'string') {
        throw new Error(
            "Invalid response format: 'title' field is missing or not a string",
        );
    }
    const title: string = parsed.title;

    if (!parsed.methods || !Array.isArray(parsed.methods)) {
        throw new Error(
            "Invalid response format: 'methods' field is missing or not an array",
        );
    }

    const methods: Method[] = parsed.methods.map(
        (
            item: { title: string; explanation: string; steps: string[] },
            index: number,
        ) => ({
            methodID: `method_${index + 1}`,
            title: item.title,
            explanation: item.explanation,
            steps: item.steps.map((step: string, index: number) => ({
                stepID: `step_${index + 1}`,
                content: step,
            })),
        }),
    );

    return { title, methods };
}

export async function generateMethods(problem: Problem): Promise<Problem> {
    if (problem.methods.length !== 0) {
        return problem;
    }

    const answer = await generateMethodsForProblem(problem);

    if (!answer.choices || answer.choices.length === 0) {
        throw new Error('No choices returned from OpenAI');
    }

    if (!answer.choices[0].message.content) {
        throw new Error('No content in the first choice message');
    }

    const content = answer.choices[0].message.content;

    try {
        const { title, methods } = parseResponse(content);
        problem.title = title;
        problem.methods = methods;
    } catch (error) {
        console.log('Failed to parse JSON response:', content);
        throw error;
    }

    return problem;
}
