// di/modules/events.module.ts

import type { Registry } from '../types';

import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import { LogEventUseCase } from '@/application/use-cases/log-event.use-case';

// local backends (no external services needed)
import { EventsRepositoryMemory } from '@/infrastructure/repositories/events.repository.memory';
import { EventsRepositoryFile } from '@/infrastructure/repositories/events.repository.file';
// prod backend (enable later)
// import { EventsRepositorySupabase } from "@/src/infrastructure/repositories/events.repository.supabase";

/** Narrow structural type for the container (matches what we actually use). */
type ContainerLike = {
    register: (
        key: keyof Registry & string,
        factory: (c: ContainerLike) => any,
    ) => void;
    resolve: <T = any>(key: keyof Registry & string) => T;
};

type Module = () => (container: ContainerLike) => void | (() => void);

function makeEventsRepo(): IEventsRepository {
    const mode = (process.env.USE_EVENT_REPO ?? 'memory').toLowerCase();
    switch (mode) {
        case 'file':
            return new EventsRepositoryFile();
        // case "supabase":
        //   return new EventsRepositorySupabase();
        case 'memory':
        default:
            return new EventsRepositoryMemory();
    }
}

export const eventsModule: Module = () => (container) => {
    // repositories
    container.register('EventsRepository', () => makeEventsRepo());

    // use cases
    container.register(
        'LogEventUseCase',
        (c) => new LogEventUseCase(c.resolve('EventsRepository')),
    );

    // optional disposer
    return () => {
        /* no-op */
    };
};
