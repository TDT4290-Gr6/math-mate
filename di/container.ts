import { countriesModule } from './modules/countries.module';
import { type DI_RETURN_TYPES, DI_SYMBOLS } from './types';
import { solvesModule } from './modules/solves.module';
import { usersModule } from './modules/users.module';
import { authModule } from './modules/auth.module';
import { createContainer } from '@evyweb/ioctopus';

const container = createContainer();

container.load(Symbol('countriesModule'), countriesModule());
container.load(Symbol('usersModule'), usersModule());
container.load(Symbol('authModule'), authModule());
container.load(Symbol('solvesModule'), solvesModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K,
): DI_RETURN_TYPES[K] {
    return container.get(DI_SYMBOLS[symbol]);
}
