import { z } from 'zod';

export const countrySchema = z.object({
    id: z.string().min(2).max(2),
    name: z.string().min(1).max(100),
});

export type Country = z.infer<typeof countrySchema>;

export const insertCountrySchema = countrySchema.pick({ name: true });

export type CountryInsert = z.infer<typeof insertCountrySchema>;
