declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to assert logged in
     * @example cy.assertLoggedIn()
     */
    assertLoggedIn(): Chainable<Element>;
    /**
     * Custom command to assert logged out
     * @example cy.assertLoggedOut()
     */
    assertLoggedOut(): Chainable<Element>;
    /**
     * Custom command to login test user
     * @example cy.login()
     */
    login(email: string, password: string): Chainable<Element>;
  }
}
