import type { Event, InsertEvent } from '@/entities/models/event';

export interface IEventsRepository {
    create(event: InsertEvent): Promise<Event>;
}
