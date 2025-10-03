import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';
 
import { createEventController } from '@/interface-adapters/controllers/create-event.controller';
import { LogEventUseCase } from '@/application/use-cases/log-event.use-case';
 
// TODO: swap these to your real repo when ready
import { MockEventsRepository } from '@/infrastructure/repositories/events.repository.mock';
// import { EventsRepository } from '@/infrastructure/repositories/events.repository';
 
export function eventsModule() {
  const events = createModule();
 
  // Repository
  if (process.env.NODE_ENV === 'test') {
    events.bind(DI_SYMBOLS.IEventsRepository).toClass(MockEventsRepository);
  } else {
    // events.bind(DI_SYMBOLS.IEventsRepository).toClass(EventsRepository);
    events.bind(DI_SYMBOLS.IEventsRepository).toClass(MockEventsRepository); // temp
  }
 
  // Use case (class)
  events.bind(DI_SYMBOLS.ILogEventUseCase).toClass(LogEventUseCase);
 
  // Controller (higher-order function factory)
  events
    .bind(DI_SYMBOLS.ICreateEventController)
    .toHigherOrderFunction(createEventController, [
      DI_SYMBOLS.ILogEventUseCase,
    ]);
 
  return events;
}
 
 