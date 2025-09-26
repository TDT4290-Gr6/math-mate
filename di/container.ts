import { countriesModule } from './modules/countries.module';
import { createContainer } from '@evyweb/ioctopus';
import { Registry } from './types';

export const container = createContainer<Registry>();

container.load('countriesModule', countriesModule());
