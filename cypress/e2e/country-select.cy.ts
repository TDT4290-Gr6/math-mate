/// <reference types="cypress" />

describe('country select', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    it('allows selecting a country', () => {
        cy.login('cypress-country-select');
        cy.visit('/');
        cy.contains('Country of residence:').should('be.visible');
        cy.get('button')
            .contains('Select country')
            .should('be.visible')
            .click();
        cy.get('[data-slot="command-item"]')
            .contains('Norway')
            .should('be.visible')
            .click();
        cy.get('button').contains('Submit').should('be.visible').click();
        cy.contains('Country of residence:').should('not.exist');
    });
});
