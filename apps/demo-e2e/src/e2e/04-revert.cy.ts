/**
 * Test revert on spill behavior
 * Verifies revertOnSpill option
 */
describe('Drag & Drop - Revert on Spill', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Revert').scrollIntoView();
  });

  it('should revert item to original position on spill', () => {
    cy.contains('Revert').parent().within(() => {
      cy.get('[dragula]').first().as('revertContainer');
      
      cy.get('@revertContainer').find('div').its('length').then((initialCount) => {
        cy.get('@revertContainer').find('div').first().as('revertItem');
        cy.get('@revertItem').invoke('text').as('itemText');
        
        // Drag item and drop outside
        cy.get('@revertItem').trigger('mousedown', { button: 0 });
        cy.wait(100);
        cy.get('body').trigger('dragover');
        cy.get('body').trigger('drop');
        cy.get('@revertItem').trigger('dragend');
        
        cy.wait(200);
        
        // With revertOnSpill, item should still be in original container
        cy.get('@revertContainer').find('div').should('have.length', initialCount);
        cy.get('@itemText').then((text) => {
          cy.get('@revertContainer').should('contain', text);
        });
      });
    });
  });
});
