import { createEventController } from '@/interface-adapters/controllers/create-event.controller';
import { MockEventsRepository } from '@/infrastructure/repositories/events.repository.mock';
import { EventsRepository } from '@/infrastructure/repositories/events.repository';
import { LogEventUseCase } from '@/application/use-cases/log-event.use-case';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

/**
 * eventsModule
 *
 * Configures and returns the dependency injection module for event logging and tracking.
 *
 * - Binds `IEventsRepository` to a mock implementation (`MockEventsRepository`) when testing,
 *   or to the real `EventsRepository` in production.
 * - Binds `ILogEventUseCase` to `LogEventUseCase`, injecting `IEventsRepository`.
 * - Binds `ICreateEventController` to `createEventController`, injecting `ILogEventUseCase`
 *   and `IAuthenticationService`.
 *
 * This module centralizes all dependencies for logging and managing events within the application,
 * ensuring that events are recorded consistently for analytics and user activity tracking.
 *
 * @returns {Module} The configured DI module for event-related services.
 */
export function eventsModule() {
    const events = createModule();

    // Repository
    if (process.env.NODE_ENV === 'test') {
        events.bind(DI_SYMBOLS.IEventsRepository).toClass(MockEventsRepository);
    } else {
        events.bind(DI_SYMBOLS.IEventsRepository).toClass(EventsRepository);
    }

    // Use case (factory)
    events
        .bind(DI_SYMBOLS.ILogEventUseCase)
        .toHigherOrderFunction(LogEventUseCase, [DI_SYMBOLS.IEventsRepository]);

    // Controller (higher-order function factory)
    events
        .bind(DI_SYMBOLS.ICreateEventController)
        .toHigherOrderFunction(createEventController, [
            DI_SYMBOLS.ILogEventUseCase,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    return events;
}
