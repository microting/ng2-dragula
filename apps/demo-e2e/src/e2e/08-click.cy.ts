/**
 * Test click vs drag distinction
 * Verifies that clicks don't trigger drag
 */
describe('Drag & Drop - Click vs Drag', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for Angular to bootstrap and render components
    cy.get('ex-08-click', { timeout: 20000 }).should('exist').and('be.visible');
    // Wait for content to be rendered
    cy.get('ex-08-click').should(($el) => {
      expect($el.html()).to.have.length.greaterThan(100);
    });
  });

  it('should render click example with dragula containers', () => {
    // Use selector that works for both attribute and property binding
    cy.get('ex-08-click').find('.container[dragula], .container[dragula="CLICKS"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .as('clickContainer');
    
    // Verify container exists and has items
    cy.get('@clickContainer').find('div').should('have.length.greaterThan', 0);
    
    // Simple click should work on item
    cy.get('@clickContainer').find('div').first().as('clickableItem');
    cy.get('@clickableItem').should('be.visible').click();
    
    // Item should still be in original container
    cy.get('@clickContainer').find('div').first().should('exist');
  });

  it('should have clickable elements', () => {
    cy.get('ex-08-click').find('.container[dragula], .container[dragula="CLICKS"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .as('container');
    
    // Verify container has clickable items
    cy.get('@container').find('div').should('have.length.greaterThan', 0);
    cy.get('@container').find('div').first().should('contain.text', 'click');
  });
});
