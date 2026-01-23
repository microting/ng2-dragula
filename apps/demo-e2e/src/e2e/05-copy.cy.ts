/**
 * Test copy functionality
 * Verifies that items are copied instead of moved
 */
describe('Drag & Drop - Copy', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Copy').scrollIntoView();
  });

  it('should copy items instead of moving them', () => {
    // Find the copy example section
    cy.contains('Copy').parent().within(() => {
      cy.get('[dragula]').first().as('copySource');
      cy.get('[dragula]').eq(1).as('copyTarget');
      
      cy.get('@copySource').find('div').its('length').as('sourceCount');
      cy.get('@copyTarget').find('div').its('length').as('targetCount');
      
      cy.get('@copySource').find('div').first().as('copyItem');
      cy.get('@copyItem').invoke('text').as('itemText');
      
      // Drag from copy source
      cy.get('@copyItem').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@copyTarget').trigger('dragover');
      cy.get('@copyTarget').trigger('drop');
      cy.get('@copyItem').trigger('dragend');
      
      cy.wait(200);
      
      // Verify item was copied (source still has it, target has new copy)
      cy.get('@sourceCount').then((originalCount) => {
        cy.get('@copySource').find('div').should('have.length', originalCount);
      });
      
      cy.get('@itemText').then((text) => {
        cy.get('@copyTarget').should('contain', text);
      });
    });
  });
});
