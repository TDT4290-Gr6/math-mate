/// <reference types="cypress" />

describe('start to problem flow', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    it('lets authenticated user pick a subject and navigate to problems', () => {
        cy.login('cypress-start');
        cy.visit('/protected/start');

        // Verify the start page content is visible
        cy.contains('Choose which categories of math you want to work with:').should('be.visible');

        // Select a subject (Algebra) and ensure it is saved to localStorage
        cy.contains('label', 'Algebra').should('be.visible').click();

        cy.window().then((win) => {
            const raw = win.localStorage.getItem('selectedSubjects');
            if (!raw) throw new Error('selectedSubjects not set in localStorage');
            const parsed = JSON.parse(raw as string);
            expect(parsed).to.include('Algebra');
        });

        // Ensure the country selection is completed if a country prompt is present.
        // This mirrors the explicit flow in `country-select.cy.ts` and avoids a
        // global scroll-lock blocking subsequent clicks.
        cy.get('body').then(($body) => {
            // jQuery :contains works here to detect the button text without failing
            if ($body.find('button:contains("Select country")').length) {
                cy.contains('button', 'Select country').should('be.visible').click();
                cy.get('[data-slot="command-item"]').contains('Norway').should('be.visible').click();
                cy.contains('button', 'Submit').should('be.visible').click();
                // wait for the overlay/scroll-lock to be removed after submit
                cy.get('body', { timeout: 5000 }).should('not.have.attr', 'data-scroll-locked', '1');
            }
        });

        // Start practicing and ensure we navigate to the problems page
        // Wait until any global scroll-lock / focus trap is released (some modals add
        // `pointer-events: none` on <body>, which blocks clicks). Give it up to 10s.
        cy.get('body', { timeout: 10000 }).should('not.have.css', 'pointer-events', 'none');

        // As an extra safety, send Escape to close stray dialogs (no-op if none open)
        cy.get('body').type('{esc}');

        cy.get('button')
            .contains('Start Practicing')
            .should('be.visible')
            .click();

        cy.url().should('include', '/protected/problem');
        cy.contains('Get started solving').should('be.visible');
    });
});
