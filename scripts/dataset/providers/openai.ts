import { Problem, ProblemMethodsResponseSchema } from '../types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ quiet: true, path: '.env.local' });

/**
 * Generates solution methods for a given math problem using the OpenAI API.
 *
 * This function sends a prompt and problem details to the OpenAI chat completion endpoint,
 * requesting a response in a strict JSON schema format defined by `ProblemMethodsResponseSchema`.
 * The response is parsed and validated against the schema before being returned.
 *
 * @param problem - The math problem to generate methods for, including its subject and solution.
 * @param prompt - The system prompt to guide the OpenAI model's response.
 * @returns A parsed and validated response containing problem-solving methods, or `null` if no content is returned.
 *
 * @throws If the response cannot be parsed or does not match the expected schema, or if the API request fails.
 */
export async function generateMethodsOpenAI(problem: Problem, prompt: string) {
    const token = process.env['OPENAI_API_KEY'];
    const model = 'gpt-5-mini';
    const client = new OpenAI({ apiKey: token });

    const response = await client.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: prompt },
            {
                role: 'system',
                content: `Subject: ${problem.subject}. Final answer: $${problem.solution}$`,
            },
            { role: 'user', content: problem.problem },
        ],
        // Ensure the response is in JSON format and adheres to the specified schema
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

    // Use Zod to parse and validate the response against the schema
    // This should be safe due to the response_format in the request
    return ProblemMethodsResponseSchema.parse(JSON.parse(content));
}
