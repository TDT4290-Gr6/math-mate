import type { IEventsRepository } from "@/application/repositories/events.repository.interface";
import type { Event } from "@/entities/models/event";
import { insertEventSchema } from "@/entities/models/event";

export class EventsRepositoryMemory implements IEventsRepository {
  private store: Event[] = [];
  private nextId = 1;

  async create(input: unknown): Promise<Event> {
    // validate with your existing schema
    const dto = insertEventSchema.parse(input);
    const row: Event = {
      id: this.nextId++,
      userId: dto.userId,
      sessionId: dto.sessionId,
      actionName: dto.actionName,
      loggedAt: dto.loggedAt ?? new Date(),
      problemId: dto.problemId,
      methodId: dto.methodId,
      stepId: dto.stepId,
      payload: dto.payload,
    };
    this.store.push(row);
    return row;
  }

  // (handy in dev) — not used by prod code
  all(): Event[] { return [...this.store]; }
  clear(): void { this.store = []; this.nextId = 1; }
}
