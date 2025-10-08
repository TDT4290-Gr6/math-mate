import { countrySchema } from './country';
import { z } from 'zod';

export const userSchema = z.object({
    uuid: z.uuid(),
    id: z.int().min(1),
    score: z.float64().min(0).max(1).default(0),
    country: countrySchema.shape.id,
});

export type User = z.infer<typeof userSchema>;

export const userInsertSchema = userSchema.pick({
    uuid: true,
    country: true,
});

export type UserInsert = z.infer<typeof userInsertSchema>;
