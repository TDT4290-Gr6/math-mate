import { countrySchema } from './country';
import { z } from 'zod';

/**
 * Zod schema representing a user in the system.
 *
 * - `uuid`: Unique string identifier for the user (from NextAuth or external auth provider).
 * - `id`: Numeric user ID (must be >= 1).
 * - `score`: User score between 0 and 5, defaults to 0.
 * - `countryId`: Optional ID of the user's associated country.
 */
export const userSchema = z.object({
    uuid: z.string(),
    id: z.int().min(1),
    score: z.float64().min(0).max(5).default(0),
    countryId: countrySchema.shape.id.optional(),
});

/** Type representing a validated `User` object. */
export type User = z.infer<typeof userSchema>;

/**
 * Zod schema for inserting a new user.
 *
 * Includes only the fields required to create a user:
 * - `uuid`
 */
export const userInsertSchema = userSchema.pick({
    uuid: true,
});

/** Type representing the data required to insert a new user. */
export type UserInsert = z.infer<typeof userInsertSchema>;
