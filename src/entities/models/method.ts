import { insertStepSchema, stepSchema } from './step';
import { z } from 'zod';

export const methodSchema = z.object({
    id: z.int(),
    title: z.string(),
    description: z.string(),
    steps: z.array(stepSchema),
});

export type Method = z.infer<typeof methodSchema>;

export const insertMethodSchema = methodSchema
    .pick({
        title: true,
        description: true,
    })
    .extend({ steps: z.array(insertStepSchema) });

export type MethodInsert = z.infer<typeof insertMethodSchema>;
