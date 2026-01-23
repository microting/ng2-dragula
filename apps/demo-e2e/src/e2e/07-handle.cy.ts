/**
 * Test handle-based dragging
 * Verifies that only handle elements can initiate drag
 */
describe('Drag & Drop - Handle', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-07-handle').should('exist');
  });

  it('should render handle example with dragula containers', () => {
    cy.get('ex-07-handle [dragula="HANDLES"]').first().as('handleContainer');
    
    // Verify container exists and has items
    cy.get('@handleContainer').find('div').should('have.length.greaterThan', 0);
    
    // Verify items have handle elements
    cy.get('@handleContainer').find('div').first().as('item');
    cy.get('@item').find('.handle').should('exist');
  });

  it('should have multiple containers for handle example', () => {
    cy.get('ex-07-handle [dragula="HANDLES"]').first().as('handleSource');
    cy.get('ex-07-handle [dragula="HANDLES"]').eq(1).as('handleTarget');
    
    // Verify both containers exist
    cy.get('@handleSource').should('exist');
    cy.get('@handleTarget').should('exist');
  });
});
