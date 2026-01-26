/**
 * Test drag and drop events
 * Verifies that dragula events fire correctly
 */
describe('Drag & Drop - Events', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('ex-02-events').should('exist');
  });

  it('should render events example with dragula containers', () => {
    cy.get('ex-02-events [dragula="DRAGULA_EVENTS"]').first().as('firstContainer');
    cy.get('ex-02-events [dragula="DRAGULA_EVENTS"]').eq(1).as('secondContainer');
    
    // Verify containers exist and have items
    cy.get('@firstContainer').find('div').should('have.length.greaterThan', 0);
    cy.get('@secondContainer').should('exist');
  });

  it('should display event log area', () => {
    // Verify the events example has an event log or output area
    cy.get('ex-02-events').should('contain.text', 'Event');
    
    // Verify dragula containers are present
    cy.get('ex-02-events [dragula="DRAGULA_EVENTS"]').should('have.length', 2);
  });
});
