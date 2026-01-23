/**
 * Test basic drag and drop functionality
 */
describe('Drag & Drop - Basic', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should drag an item between containers', () => {
    // Find dragula containers in the basic example
    cy.get('[dragula]').first().as('firstContainer');
    cy.get('[dragula]').eq(1).as('secondContainer');

    // Get initial item counts
    cy.get('@firstContainer').find('div').its('length').as('firstCount');
    cy.get('@secondContainer').find('div').its('length').as('secondCount');

    // Drag first item from first container
    cy.get('@firstContainer').find('div').first().as('dragItem');
    
    // Store item text to verify it moved
    cy.get('@dragItem').invoke('text').then((itemText) => {
      // Perform drag and drop
      cy.get('@dragItem').trigger('mousedown', { button: 0 });
      cy.wait(100); // Small delay for dragula to initialize
      
      cy.get('@secondContainer').trigger('dragover');
      cy.get('@secondContainer').trigger('drop');
      
      cy.get('@dragItem').trigger('dragend');

      // Verify item moved to second container
      cy.get('@secondContainer').should('contain', itemText);
    });
  });

  it('should maintain drag and drop within same container', () => {
    cy.get('[dragula]').first().as('container');
    
    cy.get('@container').find('div').its('length').then((initialCount) => {
      // Drag an item within the same container
      cy.get('@container').find('div').first().trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@container').trigger('dragover');
      cy.get('@container').trigger('drop');
      
      // Count should remain the same
      cy.get('@container').find('div').should('have.length', initialCount);
    });
  });
});
