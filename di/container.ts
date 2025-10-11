import { countriesModule } from './modules/countries.module';
import { usersModule } from './modules/users.module';
import { chatModule } from './modules/chat.module';
import { authModule } from './modules/auth.module';
import { createContainer } from '@evyweb/ioctopus';
import { Registry } from './types';

export const container = createContainer<Registry>();

container.load('countriesModule', countriesModule());
container.load('usersModule', usersModule());
container.load('authModule', authModule());
container.load('chatModule', chatModule());
