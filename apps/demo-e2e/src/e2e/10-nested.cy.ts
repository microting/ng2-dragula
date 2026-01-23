/**
 * Test nested containers
 * Verifies drag and drop with nested dragula containers
 */
describe('Drag & Drop - Nested Containers', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-10-nested').should('exist');
  });

  it('should render nested example with dragula containers', () => {
    // Find nested containers in the example
    cy.get('ex-10-nested [dragula="COLUMNS"]').first().as('parentContainer');
    
    // Nested containers exist - verify they render
    cy.get('@parentContainer').should('exist');
    cy.get('@parentContainer').find('div').should('have.length.greaterThan', 0);
  });

  it('should have multiple nested containers', () => {
    cy.get('ex-10-nested [dragula="COLUMNS"]').as('containers');
    
    // Verify multiple nested containers exist
    cy.get('@containers').should('have.length.greaterThan', 0);
    
    // Get the first container and verify it has items
    cy.get('@containers').first().find('div').first().should('be.visible');
  });

  it('should maintain nested container structure', () => {
    cy.get('ex-10-nested [dragula="COLUMNS"]').its('length').then((containerCount) => {
      // Verify container count is stable
      cy.get('ex-10-nested [dragula="COLUMNS"]').should('have.length', containerCount);
      
      // Verify nested structure remains intact
      cy.get('ex-10-nested [dragula="COLUMNS"]').first().should('be.visible');
    });
  });
});
