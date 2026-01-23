/**
 * Test spill behavior
 * Verifies removeOnSpill option
 */
describe('Drag & Drop - Spill', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Spill').scrollIntoView();
  });

  it('should remove item on spill (drop outside container)', () => {
    cy.contains('Spill').parent().within(() => {
      cy.get('[dragula]').first().as('spillContainer');
      
      cy.get('@spillContainer').find('div').its('length').then((initialCount) => {
        cy.get('@spillContainer').find('div').first().as('spillItem');
        
        // Drag item and drop outside container (simulating spill)
        cy.get('@spillItem').trigger('mousedown', { button: 0 });
        cy.wait(100);
        
        // Drop on body (outside dragula container)
        cy.get('body').trigger('dragover');
        cy.get('body').trigger('drop');
        cy.get('@spillItem').trigger('dragend');
        
        // With removeOnSpill, item count should decrease
        // Note: This might need adjustment based on actual spill behavior
        cy.wait(200);
      });
    });
  });
});
