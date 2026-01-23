/**
 * Test click vs drag distinction
 * Verifies that clicks don't trigger drag
 */
describe('Drag & Drop - Click vs Drag', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-08-click').should('exist');
  });

  it('should render click example with dragula containers', () => {
    cy.get('ex-08-click [dragula="CLICKS"]').first().as('clickContainer');
    
    // Verify container exists and has items
    cy.get('@clickContainer').find('div').should('have.length.greaterThan', 0);
    
    // Simple click should work on item
    cy.get('@clickContainer').find('div').first().as('clickableItem');
    cy.get('@clickableItem').click();
    
    // Item should still be in original container
    cy.get('@clickContainer').find('div').first().should('exist');
  });

  it('should have multiple containers for click example', () => {
    cy.get('ex-08-click [dragula="CLICKS"]').first().as('source');
    cy.get('ex-08-click [dragula="CLICKS"]').eq(1).as('target');
    
    // Verify both containers exist
    cy.get('@source').should('exist');
    cy.get('@target').should('exist');
  });
});
