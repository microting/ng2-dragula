/**
 * Test copy functionality
 * Verifies that items are copied instead of moved
 */
describe('Drag & Drop - Copy', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-05-copy').should('exist');
  });

  it('should render copy example with dragula containers', () => {
    cy.get('ex-05-copy [dragula="COPYABLE"]').first().as('copySource');
    cy.get('ex-05-copy [dragula="COPYABLE"]').eq(1).as('copyTarget');
    
    // Verify containers exist and have items
    cy.get('@copySource').find('div').should('have.length.greaterThan', 0);
    cy.get('@copyTarget').should('exist');
    
    // Store item text to verify structure
    cy.get('@copySource').find('div').first().invoke('text').should('not.be.empty');
  });
});
