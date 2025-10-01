import { problemSchema } from './problem';
import { z } from 'zod';

export const methodSchema = z.object({
    id: z.int(),
    problemId: problemSchema.shape.id,
    // missmatch to supabase, optional?
    title: z.string(),
    description: z.string(),
});

export type Method = z.infer<typeof methodSchema>;

export const insertMethodSchema = methodSchema.pick({
    problemId: true,
    title: true,
    description: true,
});

export type MethodInsert = z.infer<typeof insertMethodSchema>;
