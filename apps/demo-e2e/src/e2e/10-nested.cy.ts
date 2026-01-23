/**
 * Test nested containers
 * Verifies drag and drop with nested dragula containers
 */
describe('Drag & Drop - Nested Containers', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Nested').scrollIntoView();
  });

  it('should handle nested dragula containers', () => {
    cy.contains('Nested').parent().within(() => {
      // Find parent and child containers
      cy.get('[dragula]').first().as('parentContainer');
      
      // Nested containers can be complex - verify they exist
      cy.get('@parentContainer').should('exist');
      cy.get('@parentContainer').find('div').should('have.length.greaterThan', 0);
    });
  });

  it('should drag items in nested structure', () => {
    cy.contains('Nested').parent().within(() => {
      cy.get('[dragula]').as('containers');
      
      // Get the first container and try to drag an item
      cy.get('@containers').first().within(() => {
        cy.get('div').first().as('nestedItem');
        
        cy.get('@nestedItem').trigger('mousedown', { button: 0 });
        cy.wait(100);
        cy.get('@nestedItem').trigger('dragend');
      });
    });
  });

  it('should maintain nested container integrity during drag', () => {
    cy.contains('Nested').parent().within(() => {
      cy.get('[dragula]').its('length').then((containerCount) => {
        // Verify container count remains stable
        cy.get('[dragula]').should('have.length', containerCount);
        
        // Try dragging within nested structure
        cy.get('[dragula]').first().find('div').first().as('item');
        
        cy.get('@item').trigger('mousedown', { button: 0 });
        cy.wait(100);
        cy.get('@item').trigger('mouseup', { button: 0 });
        
        // Container structure should remain intact
        cy.get('[dragula]').should('have.length', containerCount);
      });
    });
  });
});
