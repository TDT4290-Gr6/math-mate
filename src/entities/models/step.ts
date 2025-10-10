import { z } from 'zod';

export const stepSchema = z.object({
    id: z.int(),
    stepNumber: z.int().min(1),
    content: z.string(),
});

export type Step = z.infer<typeof stepSchema>;

export const insertStepSchema = stepSchema.pick({
    stepNumber: true,
    content: true,
});

export type StepInsert = z.infer<typeof insertStepSchema>;
