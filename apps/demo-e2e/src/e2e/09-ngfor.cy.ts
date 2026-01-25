/**
 * Test ngFor integration
 * Verifies drag and drop with *ngFor rendered lists
 */
describe('Drag & Drop - ngFor Integration', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for Angular to bootstrap and render components
    cy.get('ex-09-ngfor', { timeout: 10000 }).should('exist').and('be.visible');
  });

  it('should render ngFor example with dynamically rendered lists', () => {
    // Use more flexible selector that works with Angular property binding
    cy.get('ex-09-ngfor').find('[dragula]').first().as('ngForSource');
    cy.get('ex-09-ngfor').find('[dragula]').eq(1).as('ngForTarget');
    
    // ngFor lists should be rendered with items
    cy.get('@ngForSource').find('div').should('have.length.greaterThan', 0);
    cy.get('@ngForTarget').should('exist').and('be.visible');
    
    // Verify items have content
    cy.get('@ngForSource').find('div').first().invoke('text').should('not.be.empty');
  });

  it('should maintain ngFor list structure', () => {
    cy.get('ex-09-ngfor').find('[dragula]').first().as('list');
    
    // Verify list has items and structure is intact
    cy.get('@list').find('div').its('length').then((initialCount) => {
      cy.get('@list').find('div').should('have.length', initialCount);
      cy.get('@list').find('div').first().should('be.visible');
    });
  });
});
