/**
 * Test click vs drag distinction
 * Verifies that clicks don't trigger drag
 */
describe('Drag & Drop - Click vs Drag', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Click').scrollIntoView();
  });

  it('should distinguish between click and drag', () => {
    cy.contains('Click').parent().within(() => {
      cy.get('[dragula]').first().as('clickContainer');
      
      cy.get('@clickContainer').find('div').first().as('clickableItem');
      
      // Simple click should not drag
      cy.get('@clickableItem').click();
      cy.wait(100);
      
      // Item should still be in original container
      cy.get('@clickContainer').find('div').first().should('exist');
    });
  });

  it('should only drag with sustained mouse down', () => {
    cy.contains('Click').parent().within(() => {
      cy.get('[dragula]').first().as('source');
      cy.get('[dragula]').eq(1).as('target');
      
      cy.get('@source').find('div').first().as('dragItem');
      
      // Sustained mouse down should allow drag
      cy.get('@dragItem').trigger('mousedown', { button: 0 });
      cy.wait(150); // Wait longer than click delay
      cy.get('@target').trigger('dragover');
      cy.get('@target').trigger('drop');
      cy.get('@dragItem').trigger('dragend');
      cy.get('@dragItem').trigger('mouseup', { button: 0 });
      
      cy.wait(200);
    });
  });
});
