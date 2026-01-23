/**
 * Test copy with model synchronization
 * Verifies copyItem function and model updates
 */
describe('Drag & Drop - Copy with Model', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Copy').scrollIntoView();
  });

  it('should copy items and update models correctly', () => {
    // The copy-model example demonstrates copying with dragulaModel
    cy.contains('h3').contains(/copy.*model/i).parent().within(() => {
      cy.get('[dragula]').first().as('modelSource');
      cy.get('[dragula]').eq(1).as('modelTarget');
      
      // Check that items have proper data attributes or content
      cy.get('@modelSource').find('div').first().as('sourceItem');
      cy.get('@sourceItem').invoke('text').as('itemContent');
      
      cy.get('@sourceItem').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@modelTarget').trigger('dragover');
      cy.get('@modelTarget').trigger('drop');
      cy.get('@sourceItem').trigger('dragend');
      
      cy.wait(200);
      
      // Verify the item was copied with proper model data
      cy.get('@itemContent').then((content) => {
        cy.get('@modelTarget').should('contain', content);
      });
    });
  });
});
