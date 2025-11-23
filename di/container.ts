import { countriesModule } from './modules/countries.module';
import { problemsModule } from './modules/problems.module';
import { type DI_RETURN_TYPES, DI_SYMBOLS } from './types';
import { solvesModule } from './modules/solves.module';
import { eventsModule } from './modules/events.module';
import { usersModule } from './modules/users.module';
import { chatModule } from './modules/chat.module';
import { authModule } from './modules/auth.module';
import { createContainer } from '@evyweb/ioctopus';

const container = createContainer();

container.load(Symbol('countriesModule'), countriesModule());
container.load(Symbol('usersModule'), usersModule());
container.load(Symbol('authModule'), authModule());
container.load(Symbol('solvesModule'), solvesModule());
container.load(Symbol('problemsModule'), problemsModule());
container.load(Symbol('chatModule'), chatModule());
container.load(Symbol('eventsModule'), eventsModule());

/**
 * Dependency Injection Container
 *
 * This file sets up and initializes the application-wide dependency injection container
 * using the `ioctopus` library. It loads all feature modules into the container:
 * - Countries
 * - Users
 * - Authentication
 * - Solves
 * - Problems
 * - Chat
 * - Events
 *
 * The `getInjection` helper function provides a type-safe way to retrieve
 * dependencies by their DI symbol from the container.
 *
 * Example usage:
 * ```ts
 * const userController = getInjection('IGetUserController');
 * ```
 *
 * @template K - The key of the DI symbol to retrieve.
 * @param {K} symbol - The key representing the dependency to fetch from the container.
 * @returns {DI_RETURN_TYPES[K]} - The resolved dependency instance associated with the symbol.
 */
export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K,
): DI_RETURN_TYPES[K] {
    return container.get(DI_SYMBOLS[symbol]);
}
