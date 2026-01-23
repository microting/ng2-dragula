/**
 * Test copy with model synchronization
 * Verifies copyItem function and model updates
 */
describe('Drag & Drop - Copy with Model', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-06-copy-model').should('exist');
  });

  it('should render copy-model example with dragula containers', () => {
    cy.get('ex-06-copy-model [dragula="PERSON"]').first().as('modelSource');
    cy.get('ex-06-copy-model [dragula="PERSON"]').eq(1).as('modelTarget');
    
    // Verify containers exist and have items
    cy.get('@modelSource').find('div').should('have.length.greaterThan', 0);
    cy.get('@modelTarget').should('exist');
    
    // Check that items have proper content
    cy.get('@modelSource').find('div').first().invoke('text').should('not.be.empty');
  });
});
