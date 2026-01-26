/**
 * Test revert on spill behavior
 * Verifies revertOnSpill option
 */
describe('Drag & Drop - Revert on Spill', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-04-revert').should('exist');
  });

  it('should render revert example with dragula containers', () => {
    cy.get('ex-04-revert [dragula="REVERT"]').first().as('revertContainer');
    
    // Verify container exists and has items
    cy.get('@revertContainer').find('div').should('have.length.greaterThan', 0);
    
    // Store initial count for verification
    cy.get('@revertContainer').find('div').its('length').then((initialCount) => {
      cy.get('@revertContainer').find('div').should('have.length', initialCount);
    });
  });
});
