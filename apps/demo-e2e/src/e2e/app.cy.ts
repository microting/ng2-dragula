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
    
    // Wait for app to fully render
    cy.get('ex-app', { timeout: 20000 }).should('exist').and('be.visible').then(($el) => {
      cy.task('log', `Found ex-app element with ${$el.length} match(es)`);
      // Verify it has content
      expect($el.html()).to.have.length.greaterThan(100);
    });
    
    cy.screenshot('03-ex-app-exists');
    
    // Check for h1 with logo - it's in index.html outside of ex-app
    cy.get('body > h1', { timeout: 20000 }).should('exist').and('be.visible').then(($h1) => {
      cy.task('log', `Found h1 element`);
      // Check for logo image inside h1
      cy.wrap($h1).find('img[alt="angular-dragula"]').should('exist').and('be.visible').then(($el) => {
        cy.task('log', `Found logo image with alt="${$el.attr('alt')}"`);
      });
    });
    
    cy.screenshot('04-h1-checked');
    
    // Check for tagline - it's also in index.html outside of ex-app
    cy.get('body > h3.tagline', { timeout: 20000 })
      .should('exist')
      .and('be.visible')
      .and(($el) => {
        const text = $el.text();
        expect(text.toLowerCase()).to.include('drag');
      })
      .then(($el) => {
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
