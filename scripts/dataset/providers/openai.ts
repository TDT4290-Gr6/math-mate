import { Problem, ProblemMethodsResponseSchema } from '../types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ quiet: true });

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-5';

export async function generateMethodsOpenAI(problem: Problem, prompt: string) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: problem.description },
            {
                role: 'user',
                content: `Subject: ${problem.topic}. Final answer: $${problem.solution}$`,
            },
        ],
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'problem_methods',
                strict: true,
                schema: z.toJSONSchema(ProblemMethodsResponseSchema),
            },
        },
    });

    const content = response.choices[0]?.message.content;
    if (!content) return null;

    return ProblemMethodsResponseSchema.parse(JSON.parse(content));
}
