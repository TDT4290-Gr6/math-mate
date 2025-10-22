declare global {
    namespace Cypress {
        interface Chainable {
            login(uuid: string): Chainable;
        }
    }
}
export {};
