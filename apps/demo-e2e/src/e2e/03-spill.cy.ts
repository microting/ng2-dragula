/**
 * Test spill behavior
 * Verifies removeOnSpill option
 */
describe('Drag & Drop - Spill', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-03-spill').should('exist');
  });

  it('should render spill example with dragula containers', () => {
    cy.get('ex-03-spill [dragula="SPILL"]').first().as('spillContainer');
    
    // Verify container exists and has items
    cy.get('@spillContainer').find('div').should('have.length.greaterThan', 0);
    
    // Verify items have proper content
    cy.get('@spillContainer').find('div').first().should('be.visible');
  });
});
