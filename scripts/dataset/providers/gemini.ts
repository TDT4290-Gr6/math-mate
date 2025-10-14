import type { ProblemInsert } from '@/entities/models/problem';
import { ProblemMethodsResponseSchema } from '../types';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true, path: '.env.local' });

/**
 * Generates solution methods for a given math problem using the Gemini model.
 *
 * This function sends a prompt and problem details to the Gemini API and expects a JSON response
 * matching to the `ProblemMethodsResponseSchema`. It parses and validates the response before returning it.
 *
 * @param problem - The math problem to generate solution methods for.
 * @param prompt - The prompt to guide the Gemini model's response.
 * @returns The parsed and validated response containing solution methods, or `null` if no response is received.
 *
 * @throws Will throw an error if the response cannot be parsed or does not match the schema, or if the API request fails.
 */
export async function generateMethodsGemini(
    problem: ProblemInsert,
    prompt: string,
) {
    const token = process.env['GEMINI_TOKEN'];
    if (!token) {
        throw new Error('GEMINI_TOKEN is not set');
    }
    const model = 'gemini-2.5-flash';
    const client = new GoogleGenAI({ apiKey: token });

    const response = await client.models.generateContent({
        model: model,
        contents: [
            prompt,
            `Subject: ${problem.subject}. Final answer: $${problem.solution}$. Problem: ${problem.problem}`,
        ],
        // Ensure the response is in JSON format and adheres to the specified schema
        config: {
            responseMimeType: 'application/json',
            responseSchema: z.toJSONSchema(ProblemMethodsResponseSchema),
        },
    });

    const message = response.text;
    if (!message) return null;

    // Use Zod to parse and validate the response against the schema
    // This should be safe due to the responseSchema in the request
    return ProblemMethodsResponseSchema.parse(JSON.parse(message));
}
