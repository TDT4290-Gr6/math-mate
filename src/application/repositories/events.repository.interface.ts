import type { Event, insertEventSchema } from '@/entities/models/event';
import { z } from 'zod';

export type InsertEvent = z.infer<typeof insertEventSchema>;

export interface IEventsRepository {
    create(event: InsertEvent): Promise<Event>;
}
