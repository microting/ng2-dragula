/**
 * Basic smoke test - migrated from Protractor
 * Verifies the demo app loads correctly
 */
describe('Demo App - Basic', () => {
  beforeEach(() => {
    cy.task('log', 'Visiting homepage...');
    cy.visit('/');
    cy.task('log', 'Homepage loaded');
    
    // Wait for Angular to bootstrap
    cy.wait(1000);
    
    // Take screenshot after page load
    cy.screenshot('01-app-loaded');
  });

  it('should display the demo app', () => {
    cy.task('log', 'Checking for ex-app element...');
    
    // Log what we find on the page
    cy.document().then((doc) => {
      cy.task('log', `Document title: ${doc.title}`);
      cy.task('log', `Body HTML length: ${doc.body.innerHTML.length}`);
    });
    
    // Check root element
    cy.get('body').should('exist');
    cy.screenshot('02-checking-ex-app');
    
    cy.get('ex-app').should('exist').then(($el) => {
      cy.task('log', `Found ex-app element with ${$el.length} match(es)`);
    });
    
    cy.screenshot('03-ex-app-exists');
    
    cy.get('h1').should('contain', 'angular-dragula').then(($el) => {
      cy.task('log', `Found h1 with text: ${$el.text()}`);
    });
    
    cy.screenshot('04-h1-checked');
    
    cy.get('h3.tagline').should('contain', 'Drag and drop so simple it hurts').then(($el) => {
      cy.task('log', `Found tagline with text: ${$el.text()}`);
    });
    
    cy.screenshot('05-tagline-checked');
  });

  it('should load all example sections', () => {
    cy.task('log', 'Checking for all example sections...');
    
    // Take full page screenshot
    cy.screenshot('06-full-page-examples', { capture: 'fullPage' });
    
    // Verify all 10 example sections are present
    const examples = ['Basic', 'Events', 'Spill', 'Revert', 'Copy', 'Handle', 'Click', 'ngFor', 'Nested'];
    
    examples.forEach((example) => {
      cy.task('log', `Looking for example: ${example}`);
      cy.contains(example).should('exist').then(($el) => {
        cy.task('log', `Found ${example} at position: top=${$el.offset()?.top}, left=${$el.offset()?.left}`);
      });
    });
    
    cy.screenshot('07-all-examples-checked');
  });
});
