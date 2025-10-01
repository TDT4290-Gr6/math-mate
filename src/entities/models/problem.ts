import { z } from 'zod';

export const problemSchema = z.object({
    id: z.int(),
    title: z.string(),
    problem: z.string(),
    solution: z.string(),
    subject: z.string(),
    level: z.int().min(1).max(5),
    // missmatch to supabase, title and description is optional
    // why descrption? should be in problem attribute
});

export type Problem = z.infer<typeof problemSchema>;

export const insertProblemSchema = problemSchema.pick({
    title: true,
    problem: true,
    solution: true,
    subject: true,
    level: true,
});

export type ProblemInsert = z.infer<typeof insertProblemSchema>;
