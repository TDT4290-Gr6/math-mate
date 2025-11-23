import { insertMethodSchema, methodSchema } from './method';
import { z } from 'zod';

/**
 * Zod schema representing a math problem.
 *
 * - `id`: Unique identifier for the problem.
 * - `title`: Optional title of the problem.
 * - `problem`: The problem statement.
 * - `solution`: The solution text.
 * - `subject`: The subject/category of the problem (e.g., "Algebra").
 * - `level`: Difficulty level (1–5).
 * - `methods`: Array of `Method` objects detailing different solution methods.
 */
export const problemSchema = z.object({
    id: z.int().nonnegative(),
    title: z.string().optional(),
    problem: z.string(),
    solution: z.string(),
    subject: z.string(),
    level: z.int().min(1).max(5),
    methods: z.array(methodSchema),
});

/** Type representing a validated `Problem` object. */
export type Problem = z.infer<typeof problemSchema>;

/**
 * Zod schema for inserting a new problem.
 *
 * Only includes the fields required for insertion:
 * - `title`, `problem`, `solution`, `subject`, `level`
 * - `methods`: Array of `MethodInsert` objects
 */
export const insertProblemSchema = problemSchema
    .pick({
        title: true,
        problem: true,
        solution: true,
        subject: true,
        level: true,
    })
    .extend({ methods: z.array(insertMethodSchema) });

/** Type representing the data required to insert a new problem. */
export type ProblemInsert = z.infer<typeof insertProblemSchema>;
