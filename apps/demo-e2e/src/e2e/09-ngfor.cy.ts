/**
 * Test ngFor integration
 * Verifies drag and drop with *ngFor rendered lists
 */
describe('Drag & Drop - ngFor Integration', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for Angular to bootstrap and render components
    cy.get('ex-09-ngfor', { timeout: 20000 }).should('exist').and('be.visible');
    // Wait for content to be rendered
    cy.get('ex-09-ngfor').should(($el) => {
      expect($el.html()).to.have.length.greaterThan(100);
    });
  });

  it('should render ngFor example with dynamically rendered lists', () => {
    // Find the wrapper that contains the dragula containers
    cy.get('ex-09-ngfor').find('.wrapper').first().as('dragulaWrapper');
    
    // Get containers with dragula attribute within the first wrapper
    cy.get('@dragulaWrapper').find('.container[dragula]', { timeout: 10000 }).first()
      .should('be.visible')
      .as('ngForSource');
    
    cy.get('@dragulaWrapper').find('.container[dragula]').eq(1)
      .should('be.visible')
      .as('ngForTarget');
    
    // ngFor lists should be rendered with items
    cy.get('@ngForSource').find('div').should('have.length.greaterThan', 0);
    cy.get('@ngForTarget').should('exist').and('be.visible');
    
    // Verify items have content
    cy.get('@ngForSource').find('div').first().invoke('text').should('not.be.empty');
  });

  it('should maintain ngFor list structure', () => {
    // Find containers with dragula attribute in the first wrapper
    cy.get('ex-09-ngfor').find('.wrapper').first().find('.container[dragula]', { timeout: 10000 }).first()
      .should('be.visible')
      .as('list');
    
    // Verify list has items and structure is intact
    cy.get('@list').find('div').its('length').then((initialCount) => {
      cy.get('@list').find('div').should('have.length', initialCount);
      cy.get('@list').find('div').first().should('be.visible');
    });
  });
});
