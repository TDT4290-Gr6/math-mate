/// <reference types="cypress" />

describe('chatbot UI (mocked)', () => {
    beforeEach(() => {
        cy.clearCookies();
    });

    it('sends a question, shows a mocked reply, preserves conversation after close/open', () => {
        cy.login('cypress-chat');

        // Ensure the session is available (some environments may not set the cookie
        // immediately). Retry once if needed by re-calling the callback endpoint.
        cy.request({ url: '/api/auth/session', failOnStatusCode: false }).then(
            (res) => {
                if (!res.body) {
                    // wait briefly and re-request session
                    cy.wait(1000);
                    cy.request({
                        url: '/api/auth/session',
                        failOnStatusCode: false,
                    })
                        .its('body')
                        .should('not.be.null');
                } else {
                    cy.wrap(res.body).should('not.be.null');
                }
            },
        );

        // Navigate to problems and start solving (mirror user flow)
        cy.visit('/protected/problem');

        // If country prompt is present, complete it to avoid scroll-lock
        cy.get('body').then(($body) => {
            if ($body.find('button:contains("Select country")').length) {
                cy.contains('button', 'Select country').click();
                cy.get('[data-slot="command-item"]').contains('Norway').click();
                cy.contains('button', 'Submit').click();
                cy.get('body', { timeout: 5000 }).should(
                    'not.have.attr',
                    'data-scroll-locked',
                    '1',
                );
            }
        });

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

        // For deterministic E2E tests we inject a small mock mapping on window so the
        // client-side chat hook (`useChatbot`) will return canned responses without
        // making network calls. This avoids fragile network interception.
        cy.window().then((win) => {
            // @ts-expect-error - test-only property
            win.__CYPRESS_CHAT_MOCKS = [
                {
                    match: '2+2',
                    reply: 'Have you tried counting your fingers?',
                },
            ];
        });

        // Type the question (this will add the user message locally) and press Enter
        cy.get('input[placeholder="Ask a question..."]', { timeout: 5000 })
            .should('be.visible')
            .type('what is 2+2{enter}');

        // Wait for any outgoing POSTs and capture the first request URL so we can stub it explicitly.
        cy.wait('@postLogger', { timeout: 5000 }).then((i) => {
            cy.log('[CYPRESS-INTERCEPT] logged POST', String(i.request.url));
            // create an explicit intercept for this exact URL to ensure we reply to the chat action
            const targetUrl = String(i.request.url || '');
            cy.intercept('POST', targetUrl, {
                statusCode: 200,
                body: {
                    success: true,
                    message: {
                        content: 'Have you tried counting your fingers?',
                    },
                },
            }).as('chatStubExact');

            // Send the message again so it hits our exact stubbed endpoint
            cy.get('input[placeholder="Ask a question..."]').type(
                'what is 2+2{enter}',
            );

            // Wait for the exact stub to be used
            cy.wait('@chatStubExact', { timeout: 5000 }).then(() => {
                cy.log('[CYPRESS-INTERCEPT] exact stub used for', targetUrl);
            });
        });

        // The assistant reply should appear (from our stub) — give it up to 5s
        cy.contains('Have you tried counting your fingers?', {
            timeout: 5000,
        }).should('be.visible');

        // Close the chatbot (click the chevron down inside the chat window)
        // the chevron SVG has class 'cursor-pointer' in the component
        cy.get('svg.cursor-pointer', { timeout: 2000 }).first().click();

        // Ensure the chat input is gone (chat closed) before moving on
        cy.get('input[placeholder="Ask a question..."]', {
            timeout: 5000,
        }).should('not.exist');

        // See the next step of the problem by clicking Next step
        cy.contains('button', 'Next step', { timeout: 5000 })
            .should('be.visible')
            .click();
        cy.contains('Step 2', { timeout: 5000 }).should('be.visible');

        // Reopen the chatbot and verify the previous conversation is still present
        cy.get('button[aria-label="Open chat"]', { timeout: 5000 })
            .should('be.visible')
            .click();
        cy.contains('what is 2+2', { timeout: 5000 }).should('be.visible');
        cy.contains('Have you tried counting your fingers?', {
            timeout: 5000,
        }).should('be.visible');
    });
});
