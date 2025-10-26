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

        // Choose another problem twice to reach the third problem
        cy.contains('button', 'Another problem').should('be.visible').click();
        cy.wait(1000);
        cy.contains('button', 'Another problem').should('be.visible').click();
        cy.wait(1000);

        // Start solving the currently shown problem
        cy.contains('button', 'Get started solving').should('be.visible').click();
        cy.wait(500);
        // On methods page: choose method 2 (the second "Get Started" button)
        cy.url({ timeout: 10000 }).should('include', '/protected/methods');
        // Use a jQuery filter to find the second visible "Get Started" button
        cy.get('button')
            .filter(':contains("Get Started")')
            .then(($btns) => {
                if ($btns.length >= 2) {
                    cy.wrap($btns.eq(1)).click();
                } else {
                    // fallback: click the first one if not enough methods
                    cy.wrap($btns.eq(0)).click();
                }
            });
        cy.wait(500);
        // On solving page: advance through all available steps before revealing the answer
        cy.url({ timeout: 10000 }).should('include', '/protected/solve');

        // Recursively click "Next step" until the button disappears
        const clickAllNextSteps = () => {
            cy.get('body').then(($body) => {
                if ($body.find('button:contains("Next step")').length) {
                    cy.contains('button', 'Next step').click();
                    cy.wait(800);
                    clickAllNextSteps();
                }
            });
        };

        clickAllNextSteps();

        // Reveal the answer and give feedback
        cy.contains('button', 'Go to answer').should('be.visible').click();
        cy.wait(500);
        cy.contains('button', 'Click to reveal answer').should('be.visible').click();
        cy.wait(500);
        // Confirm whether the user arrived at the correct answer (choose Yes)
        cy.contains('button', 'Yes').should('be.visible').click();
        cy.wait(500);
        // Rate difficulty as 3
        cy.get('button[aria-label="Rate difficulty 3"]').should('be.visible').click();
        // Finish by going to the next question
        cy.contains('button', 'Next question').should('be.visible').click();
    });
});
