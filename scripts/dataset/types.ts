import z from 'zod';

export interface DatasetEntry {
    problem: string;
    solution: string;
    answer: string;
    subject: string;
    level: number;
    unique_id: string;
}

export interface Problem {
    title: string;
    solution: string;
    level: number;
    problem: string;
    subject: string;
    methods: Method[];
}

export interface Method {
    title: string;
    description: string;
    steps: string[];
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
    problem: Problem,
    prompt: string,
) => Promise<z.infer<typeof ProblemMethodsResponseSchema> | null>;
