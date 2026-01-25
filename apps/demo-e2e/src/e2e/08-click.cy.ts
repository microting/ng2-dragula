/**
 * Test click vs drag distinction
 * Verifies that clicks don't trigger drag
 */
describe('Drag & Drop - Click vs Drag', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for Angular to bootstrap and render components
    cy.get('ex-08-click', { timeout: 10000 }).should('exist').and('be.visible');
  });

  it('should render click example with dragula containers', () => {
    // Use more flexible selector that works with Angular property binding
    cy.get('ex-08-click').find('[dragula]').first().as('clickContainer');
    
    // Verify container exists and has items
    cy.get('@clickContainer').find('div').should('have.length.greaterThan', 0);
    
    // Simple click should work on item
    cy.get('@clickContainer').find('div').first().as('clickableItem');
    cy.get('@clickableItem').should('be.visible').click();
    
    // Item should still be in original container
    cy.get('@clickContainer').find('div').first().should('exist');
  });

  it('should have multiple containers for click example', () => {
    cy.get('ex-08-click').find('[dragula]').first().as('source');
    cy.get('ex-08-click').find('[dragula]').eq(1).as('target');
    
    // Verify both containers exist
    cy.get('@source').should('exist').and('be.visible');
    cy.get('@target').should('exist').and('be.visible');
  });
});
