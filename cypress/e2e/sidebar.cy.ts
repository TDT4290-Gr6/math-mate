/// <reference types="cypress" />

describe('sidebar', () => {
    it('opens and closes', () => {
        cy.login('cypress-sidebar');

        // Go to another page than the start page to skip country selection
        cy.visit('/protected/problem');
        cy.contains('Settings:').should('not.exist');

        cy.get('button[aria-haspopup="dialog"]').should('be.visible').click();
        cy.contains('Settings:').should('be.visible');

        cy.get('button[aria-label="Close sidebar"]')
            .should('be.visible')
            .click();
        cy.contains('Settings:').should('not.exist');
    });

    it('displays user ID', () => {
        cy.login();
        // Go to another page than the start page to skip country selection
        cy.visit('/protected/problem');
        // Open sidebar
        cy.get('button[aria-haspopup="dialog"]').should('be.visible').click();
        cy.contains('User ID:').should('be.visible');

        cy.wait(1000); // wait a moment to ensure user ID is loaded

        cy.get('Failed to load').should('not.exist');

        cy.contains('span', 'User ID:')
            .next('span')
            .invoke('text')
            .then((userId) => {
                // Ensure it is a number
                expect(userId.trim()).to.match(/^\d+$/);
                cy.log(`User ID is: ${userId.trim()}`);
            });
    });

    describe('theme toggle', () => {
        it('successfully toggles light/darkmode', () => {
            cy.login('cypress-theme-1');

            // Go to another page than the start page to skip country selection
            cy.visit('/protected/problem');

            // Open sidebar
            cy.get('button[aria-haspopup="dialog"]').click();

            cy.get('button[data-slot="switch"]').click();

            cy.get('html')
                .invoke('css', 'color-scheme')
                .then((originalTheme) => {
                    // toggle once -> expect a different theme
                    cy.get('button[data-slot="switch"]').click();
                    cy.get('html')
                        .invoke('css', 'color-scheme')
                        .should('not.eq', originalTheme);

                    // toggle back -> expect original theme
                    cy.get('button[data-slot="switch"]').click();
                    cy.get('html')
                        .invoke('css', 'color-scheme')
                        .should('eq', originalTheme);
                });
        });

        it('successfully persists theme changes on page reload', () => {
            cy.login('cypress-theme-2');

            // Go to another page than the start page to skip country selection
            cy.visit('/protected/problem');

            // Open sidebar
            cy.get('button[aria-haspopup="dialog"]').click();

            cy.get('button[data-slot="switch"]').click();

            cy.get('html')
                .invoke('css', 'color-scheme')
                .then((originalTheme) => {
                    // reload and verify persisted theme
                    cy.reload();
                    cy.get('html')
                        .invoke('css', 'color-scheme')
                        .should('eq', originalTheme);
                });
        });
    });

    it('does not display any solved problems when none are solved', () => {
        // Ensure user has no solved problems by using a fresh user
        cy.login();
        cy.visit('/protected/problem');

        // Open sidebar and verify no solved problems
        cy.get('button[aria-haspopup="dialog"]').should('be.visible').click();

        cy.contains('No previously solved problems.').should('be.visible');
    });

    it('displays solved problems when problems have been solved', () => {
        // Ensure user starts with no solved problems by using a fresh user
        cy.login();
        cy.visit('/protected/problem');

        // Open sidebar and verify no solved problems
        cy.get('button[aria-haspopup="dialog"]').should('be.visible').click();
        cy.contains('No previously solved problems.').should('be.visible');

        // Find a random problem and solve it
        cy.get('button')
            .contains('Get started solving')
            .should('be.visible')
            .click();
        cy.get('button').contains('Get Started').should('be.visible').click();
        cy.get('button').contains('Go to answer').should('be.visible').click();
        cy.get('button')
            .contains('Click to reveal answer')
            .should('be.visible')
            .click();
        cy.get('button').contains('No').should('be.visible').click();
        cy.get('button[aria-label="Rate difficulty 1"]')
            .should('be.visible')
            .click();
        cy.get('button').contains('Next question').should('be.visible').click();

        cy.wait(1000); // wait a moment to ensure the problem is logged as solved

        // Ensure the sidebar is closed first
        cy.contains('Previously solved problems:').should('not.exist');

        // Open sidebar (and verify)
        cy.get('button[aria-haspopup="dialog"]').should('be.visible').click();
        cy.contains('Previously solved problems:').should('be.visible');

        // Verify that no "no solved problems" message is shown
        cy.contains('No previously solved problems.').should('not.exist');
    });
});
