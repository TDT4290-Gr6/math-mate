import { insertMethodSchema, methodSchema } from './method';
import { z } from 'zod';

export const problemSchema = z.object({
    id: z.int(),
    title: z.string().optional(),
    problem: z.string(),
    solution: z.string(),
    subject: z.string(),
    level: z.int().min(1).max(5),
    methods: z.array(methodSchema),
});

export type Problem = z.infer<typeof problemSchema>;

export const insertProblemSchema = problemSchema
    .pick({
        title: true,
        problem: true,
        solution: true,
        subject: true,
        level: true,
    })
    .extend({ methods: z.array(insertMethodSchema) });

export type ProblemInsert = z.infer<typeof insertProblemSchema>;
