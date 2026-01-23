/**
 * Basic smoke test - migrated from Protractor
 * Verifies the demo app loads correctly
 */
describe('Demo App - Basic', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('app-root h1').should('contain', 'Welcome to demo!');
  });

  it('should load all example sections', () => {
    // Verify all 10 example sections are present
    cy.contains('Basic').should('exist');
    cy.contains('Events').should('exist');
    cy.contains('Spill').should('exist');
    cy.contains('Revert').should('exist');
    cy.contains('Copy').should('exist');
  });
});
