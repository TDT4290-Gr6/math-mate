import { countriesModule } from './modules/countries.module';
import { authModule } from './modules/auth.module';
import { createContainer } from '@evyweb/ioctopus';
import { eventsModule } from './modules/events.module';
import { Registry } from './types';

export const container = createContainer<Registry>();

container.load('countriesModule', countriesModule());
container.load('authModule', authModule());
container.load('eventsModule', eventsModule());
