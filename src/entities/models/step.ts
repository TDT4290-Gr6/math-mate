import { problemSchema } from './problem';
import { methodSchema } from './method';
import { z } from 'zod';

export const stepSchema = z.object({
    id: z.int(),
    methodId: methodSchema.shape.id,
    problemId: problemSchema.shape.id,
    // missmatch to superbase, optional?
    stepNumber: z.int().min(0),
    content: z.string(),
});

export type Step = z.infer<typeof stepSchema>;

export const insertStepSchema = stepSchema.pick({
    methodId: true,
    problemId: true,
    stepNumber: true,
    content: true,
});

export type StepInsert = z.infer<typeof insertStepSchema>;
