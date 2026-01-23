/**
 * Basic smoke test - migrated from Protractor
 * Verifies the demo app loads correctly
 */
describe('Demo App - Basic', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the demo app', () => {
    cy.get('ex-app').should('exist');
    cy.get('h1').should('contain', 'angular-dragula');
    cy.get('h3.tagline').should('contain', 'Drag and drop so simple it hurts');
  });

  it('should load all example sections', () => {
    // Verify all 10 example sections are present
    cy.contains('Basic').should('exist');
    cy.contains('Events').should('exist');
    cy.contains('Spill').should('exist');
    cy.contains('Revert').should('exist');
    cy.contains('Copy').should('exist');
    cy.contains('Handle').should('exist');
    cy.contains('Click').should('exist');
    cy.contains('ngFor').should('exist');
    cy.contains('Nested').should('exist');
  });
});
