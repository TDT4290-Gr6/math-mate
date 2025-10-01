import { countrySchema } from './country';
import z from 'zod';

export const userSchema = z.object({
    id: z.int(),
    // missmatch to supabase, score optional
    score: z.float64().min(0).max(1).default(0),
    country: countrySchema.shape.id,
});

export type User = z.infer<typeof userSchema>;
