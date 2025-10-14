import type { ProblemInsert } from '@/entities/models/problem';
import { z } from 'zod';

export interface DatasetEntry {
    problem: string;
    solution: string;
    answer: string;
    subject: string;
    level: number;
    unique_id: string;
}

export const MethodSchema = z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.string()),
});

export const ProblemMethodsResponseSchema = z.object({
    title: z.string(),
    methods: z.array(MethodSchema),
});

export enum LLMProviderType {
    OPENAI = 'openai',
    GEMINI = 'gemini',
}

export type ProblemMethodsGenerator = (
    problem: ProblemInsert,
    prompt: string,
) => Promise<z.infer<typeof ProblemMethodsResponseSchema> | null>;
