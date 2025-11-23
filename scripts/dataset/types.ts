import type { ProblemInsert } from '@/entities/models/problem';
import { z } from 'zod';

/**
 * Represents a single entry in a math problem dataset.
 */
export interface DatasetEntry {
    problem: string;
    solution: string;
    answer: string;
    subject: string;
    level: number;
    unique_id: string;
}

/**
 * Schema representing a single method to solve a problem.
 */
export const MethodSchema = z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.string()),
});

/**
 * Schema representing the response from a problem methods generator.
 */
export const ProblemMethodsResponseSchema = z.object({
    title: z.string(),
    methods: z.array(MethodSchema),
});

/**
 * Enum for supported Large Language Model (LLM) providers.
 */
export enum LLMProviderType {
    OPENAI = 'openai',
    GEMINI = 'gemini',
}

/**
 * Function type for generating solution methods for a given problem.
 *
 * @param problem - The problem input data.
 * @param prompt - The prompt string to guide the method generation.
 * @returns A promise that resolves to a validated problem methods response, or null if generation fails.
 */
export type ProblemMethodsGenerator = (
    problem: ProblemInsert,
    prompt: string,
) => Promise<z.infer<typeof ProblemMethodsResponseSchema> | null>;
