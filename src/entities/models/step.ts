import { z } from 'zod';

/**
 * Zod schema representing a single step in a problem-solving method.
 *
 * - `id`: Unique identifier of the step.
 * - `stepNumber`: The sequential number of the step (must be >= 1).
 * - `content`: The content or description of the step.
 */
export const stepSchema = z.object({
    id: z.int(),
    stepNumber: z.int().min(1),
    content: z.string(),
});

/** Type representing a validated `Step` object. */
export type Step = z.infer<typeof stepSchema>;

/**
 * Zod schema for inserting a new step.
 *
 * Includes only the fields required to create a step:
 * - `stepNumber`
 * - `content`
 */
export const insertStepSchema = stepSchema.pick({
    stepNumber: true,
    content: true,
});

/** Type representing the data required to insert a new step. */
export type StepInsert = z.infer<typeof insertStepSchema>;
