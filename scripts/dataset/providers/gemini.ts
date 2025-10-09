import { Problem, ProblemMethodsResponseSchema } from '../types';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import z from 'zod';

dotenv.config({ quiet: true, path: '.env.local' });

const token = process.env['GEMINI_TOKEN'];
const model = 'gemini-2.5-pro';

export async function generateMethodsGemini(problem: Problem, prompt: string) {
    const client = new GoogleGenAI({ apiKey: token });

    const response = await client.models.generateContent({
        model: model,
        contents: [
            prompt,
            `Subject: ${problem.topic}. Final answer: $${problem.solution}$. Problem: ${problem.description}`,
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: z.toJSONSchema(ProblemMethodsResponseSchema),
        },
    });

    const message = response.text;
    if (!message) {
        return null;
    }

    return ProblemMethodsResponseSchema.parse(JSON.parse(message));
}
