import { Problem, ProblemMethodsResponseSchema } from '../types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ quiet: true, path: '.env.local' });

const token = process.env['OPENAI_API_KEY'];
const model = 'gpt-5-mini';

export async function generateMethodsOpenAI(problem: Problem, prompt: string) {
    const client = new OpenAI({ apiKey: token });

    const response = await client.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: problem.problem },
            {
                role: 'user',
                content: `Subject: ${problem.subject}. Final answer: $${problem.solution}$`,
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
