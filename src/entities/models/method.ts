import { insertStepSchema, stepSchema } from './step';
import { z } from 'zod';

/**
 * Zod schema representing a method for solving a problem.
 *
 * - `id`: Unique identifier of the method.
 * - `title`: Title of the method.
 * - `description`: Detailed description of the method.
 * - `steps`: Array of `Step` objects representing the steps in the method.
 */
export const methodSchema = z.object({
    id: z.int(),
    title: z.string(),
    description: z.string(),
    steps: z.array(stepSchema),
});

/** Type representing a validated `Method` object. */
export type Method = z.infer<typeof methodSchema>;

/**
 * Zod schema for inserting a new method.
 *
 * Only requires the fields necessary to create a method:
 * - `title`: Title of the method.
 * - `description`: Description of the method.
 * - `steps`: Array of `StepInsert` objects representing the steps.
 */
export const insertMethodSchema = methodSchema
    .pick({
        title: true,
        description: true,
    })
    .extend({ steps: z.array(insertStepSchema) });

/** Type representing the data required to insert a new method. */
export type MethodInsert = z.infer<typeof insertMethodSchema>;
