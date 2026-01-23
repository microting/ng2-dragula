/**
 * Test ngFor integration
 * Verifies drag and drop with *ngFor rendered lists
 */
describe('Drag & Drop - ngFor Integration', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('ngFor').scrollIntoView();
  });

  it('should work with dynamically rendered ngFor lists', () => {
    cy.contains(/ngfor/i).parent().within(() => {
      cy.get('[dragula]').first().as('ngForSource');
      cy.get('[dragula]').eq(1).as('ngForTarget');
      
      // ngFor lists should be rendered
      cy.get('@ngForSource').find('div').should('have.length.greaterThan', 0);
      
      cy.get('@ngForSource').find('div').first().as('ngForItem');
      cy.get('@ngForItem').invoke('text').as('itemText');
      
      // Drag item from ngFor list
      cy.get('@ngForItem').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@ngForTarget').trigger('dragover');
      cy.get('@ngForTarget').trigger('drop');
      cy.get('@ngForItem').trigger('dragend');
      
      cy.wait(200);
      
      // Verify item appears in target
      cy.get('@itemText').then((text) => {
        cy.get('@ngForTarget').should('contain', text);
      });
    });
  });

  it('should update ngFor list after drag', () => {
    cy.contains(/ngfor/i).parent().within(() => {
      cy.get('[dragula]').first().as('list');
      
      cy.get('@list').find('div').its('length').then((initialCount) => {
        cy.get('@list').find('div').first().as('item');
        
        // Drag within same list
        cy.get('@item').trigger('mousedown', { button: 0 });
        cy.wait(100);
        cy.get('@list').trigger('dragover');
        cy.get('@list').trigger('drop');
        cy.get('@item').trigger('dragend');
        
        cy.wait(200);
        
        // List should still have same item count
        cy.get('@list').find('div').should('have.length', initialCount);
      });
    });
  });
});
