import { createContainer } from '@evyweb/ioctopus';
import { Registry } from './types';
import { countriesModule } from './modules/countries.module';


export const container = createContainer<Registry>();

container.load('countriesModule', countriesModule());