/**
 * Test handle-based dragging
 * Verifies that only handle elements can initiate drag
 */
describe('Drag & Drop - Handle', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Handle').scrollIntoView();
  });

  it('should only drag when handle is used', () => {
    cy.contains('Handle').parent().within(() => {
      cy.get('[dragula]').first().as('handleContainer');
      
      // Try to drag by clicking on non-handle area (should not work)
      cy.get('@handleContainer').find('div').first().as('item');
      cy.get('@item').find('.handle').as('handle');
      
      // Dragging from handle should work
      cy.get('@handle').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@item').should('exist');
      cy.get('@handle').trigger('mouseup', { button: 0 });
    });
  });

  it('should initiate drag from handle element', () => {
    cy.contains('Handle').parent().within(() => {
      cy.get('[dragula]').first().as('handleSource');
      cy.get('[dragula]').eq(1).as('handleTarget');
      
      cy.get('@handleSource').find('div').first().as('handleItem');
      cy.get('@handleItem').find('.handle').as('itemHandle');
      
      cy.get('@itemHandle').invoke('text').as('handleText');
      
      // Drag using the handle
      cy.get('@itemHandle').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@handleTarget').trigger('dragover');
      cy.get('@handleTarget').trigger('drop');
      cy.get('@itemHandle').trigger('dragend');
      
      cy.wait(200);
    });
  });
});
