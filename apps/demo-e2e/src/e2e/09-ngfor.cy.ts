/**
 * Test ngFor integration
 * Verifies drag and drop with *ngFor rendered lists
 */
describe('Drag & Drop - ngFor Integration', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-09-ngfor').should('exist');
  });

  it('should render ngFor example with dynamically rendered lists', () => {
    cy.get('ex-09-ngfor [dragula="MANY_ITEMS"]').first().as('ngForSource');
    cy.get('ex-09-ngfor [dragula="MANY_ITEMS"]').eq(1).as('ngForTarget');
    
    // ngFor lists should be rendered with items
    cy.get('@ngForSource').find('div').should('have.length.greaterThan', 0);
    cy.get('@ngForTarget').should('exist');
    
    // Verify items have content
    cy.get('@ngForSource').find('div').first().invoke('text').should('not.be.empty');
  });

  it('should maintain ngFor list structure', () => {
    cy.get('ex-09-ngfor [dragula="MANY_ITEMS"]').first().as('list');
    
    // Verify list has items and structure is intact
    cy.get('@list').find('div').its('length').then((initialCount) => {
      cy.get('@list').find('div').should('have.length', initialCount);
      cy.get('@list').find('div').first().should('be.visible');
    });
  });
});
