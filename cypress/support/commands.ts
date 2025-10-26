/// <reference types="cypress" />
/// <reference types="./commands.d.ts" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (uuid) => {
    if (uuid === undefined) {
        uuid = `cypress-${Date.now()}`;
    }

    // Ensure that the uuid starts with 'cypress' to identify test users
    if (!uuid.startsWith('cypress')) {
        throw new Error(
            "Cypress login uuid must start with 'cypress' to identify test users.",
        );
    }

    cy.session(uuid, () => {
        cy.visit('/auth/signIn');

        cy.request('/api/auth/csrf').then((response) => {
            const csrfToken = response.body.csrfToken;

            const credentials = {
                id: uuid,
                csrfToken: csrfToken,
            };

            cy.request({
                method: 'POST',
                url: '/api/auth/callback/cypress',
                form: true,
                body: credentials,
            });

            cy.wait(1000); // Wait for a second to ensure the session is established

            cy.visit('/');
            cy.getCookie('next-auth.session-token').should('exist');
        });
    });
});
