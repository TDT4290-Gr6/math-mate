/// <reference types="cypress" />

describe('chatbot UI (mocked)', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    it('sends a question, shows a mocked reply, preserves conversation after close/open', () => {
        cy.login('cypress-chat');

        // Navigate to problems and start solving (mirror user flow)
        cy.visit('/protected/problem');

        // Go to solving page
        cy.contains('button', 'Get started solving')
            .should('be.visible')
            .click();

        // Choose the first method on the methods page
        cy.url({ timeout: 10000 }).should('include', '/protected/methods');
        cy.get('button').filter(':contains("Get Started")').first().click();

        // Now on the solving page
        cy.url({ timeout: 10000 }).should('include', '/protected/solve');

        // Open the chat
        cy.get('button[aria-label="Open chat"]').should('be.visible').click();

        // Type the question (this will add the user message locally) and press Enter
        cy.get('input[placeholder="Ask a question..."]', { timeout: 5000 })
            .should('be.visible')
            .type('what is 2+2{enter}');
        // Wait a short moment for the client hook to (optionally) process the message
        // and at minimum for the user message to appear in the UI.
        cy.wait(200);
        cy.contains('what is 2+2', { timeout: 5000 }).should('be.visible');
        cy.contains('Mock reply to: "what is 2+2"', { timeout: 5000 }).should(
            'be.visible',
        );

        // Close the chatbot (click the chevron down inside the chat window)
        cy.get('button[aria-label="Close chat"]', { timeout: 2000 })
            .first()
            .click();

        // Ensure the chat input is gone (chat closed) before moving on
        cy.get('input[placeholder="Ask a question..."]', {
            timeout: 5000,
        }).should('not.exist');
        cy.contains('button', 'Next step').click();
        cy.wait(500);

        // Reopen the chatbot and verify the previous conversation is still present.
        // We avoid navigating problem steps here to keep this spec focused on
        // chat behavior and reduce flakiness when run in isolation.
        cy.get('button[aria-label="Open chat"]', { timeout: 5000 })
            .should('be.visible')
            .click();
        cy.contains('what is 2+2', { timeout: 5000 }).should('be.visible');
        cy.contains('Mock reply to: "what is 2+2"', { timeout: 5000 }).should(
            'be.visible',
        );
    });
});
