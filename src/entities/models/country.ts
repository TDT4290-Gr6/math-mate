import { z } from 'zod';

/**
 * Zod schema representing a country.
 *
 * - `id`: Unique identifier of the country (positive integer).
 * - `name`: Name of the country (1-100 characters).
 */
export const countrySchema = z.object({
    id: z.int().min(1),
    name: z.string().min(1).max(100),
});

/** Type representing a validated `Country` object. */
export type Country = z.infer<typeof countrySchema>;

/**
 * Zod schema for inserting a new country.
 *
 * Only requires the `name` field when creating a new country.
 */
export const insertCountrySchema = countrySchema.pick({ name: true });

/** Type representing the data required to insert a new country. */
export type CountryInsert = z.infer<typeof insertCountrySchema>;
