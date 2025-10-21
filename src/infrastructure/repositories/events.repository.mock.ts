import type { IEventsRepository } from '@/application/repositories/events.repository.interface';

import type { InsertEvent, Event } from '@/entities/models/event';

export class MockEventsRepository implements IEventsRepository {
    private _events: Event[] = [];
    private _idCounter = 1;

    async create(event: InsertEvent): Promise<Event> {
        const createdEvent: Event = {
            id: this._idCounter++,
            ...event,
        };

        this._events.push(createdEvent);
        return createdEvent;
    }

    async getAll(): Promise<Event[]> {
        return this._events;
    }

    clear() {
        this._events = [];
        this._idCounter = 1;
    }
}
