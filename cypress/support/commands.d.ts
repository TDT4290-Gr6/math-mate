declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to log in a user with a given UUID. The session is cached per UUID for
             * a cypress test run.
             *
             * If no UUID is provided, a unique one is generated to create a new user. This is
             * useful if you require a completely fresh user for each test (e.g. you require the
             * country select popup, or no previously solved problems).
             *
             * If a UUID is provided, the same user will be used across tests (useful for speeding
             * up tests, as it avoids re-creating the user).
             *
             * @param uuid - The UUID of the user to log in. Must start with 'cypress' to identify
             * test users.
             */
            login(uuid?: string): Chainable;
        }
    }
}
export {};
