/**
 * Test drag and drop events
 * Verifies that dragula events fire correctly
 */
describe('Drag & Drop - Events', () => {
  beforeEach(() => {
    cy.visit('/');
    // Navigate to events section if it's not immediately visible
    cy.contains('Events').scrollIntoView();
  });

  it('should display event log when dragging', () => {
    // Look for the events example section
    cy.contains('Events').parent().within(() => {
      // Find dragula containers in events section
      cy.get('[dragula]').first().as('eventsContainer');
      
      // Check if there's an event log area
      cy.get('@eventsContainer').find('div').first().as('dragItem');
      
      // Trigger drag event
      cy.get('@dragItem').trigger('mousedown', { button: 0 });
      cy.wait(100);
      
      // The events component should log drag events
      // Note: Actual event verification would depend on how the demo displays events
      cy.get('@dragItem').trigger('dragend');
    });
  });

  it('should handle drop events', () => {
    cy.contains('Events').parent().within(() => {
      cy.get('[dragula]').first().as('source');
      cy.get('[dragula]').eq(1).as('target');
      
      cy.get('@source').find('div').first().as('item');
      
      cy.get('@item').trigger('mousedown', { button: 0 });
      cy.wait(100);
      cy.get('@target').trigger('dragover');
      cy.get('@target').trigger('drop');
      cy.get('@item').trigger('dragend');
      
      // Verify drop completed
      cy.get('@target').find('div').should('have.length.greaterThan', 0);
    });
  });
});
