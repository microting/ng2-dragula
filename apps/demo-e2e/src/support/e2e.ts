// Import commands.js using ES2015 syntax:
import './commands';

// Add better error logging and debugging
Cypress.on('fail', (error, runnable) => {
  // Take screenshot on failure with test name
  const testName = runnable.fullTitle().replace(/[^a-z0-9]/gi, '_');
  cy.screenshot(`failed-${testName}`, { capture: 'fullPage' });
  
  // Log detailed error information
  cy.task('log', `Test failed: ${runnable.fullTitle()}`);
  cy.task('log', `Error: ${error.message}`);
  cy.task('log', `Stack: ${error.stack}`);
  
  // Re-throw the error to fail the test
  throw error;
});

// Log test start
beforeEach(function() {
  cy.task('log', `Starting test: ${this.currentTest?.fullTitle() || 'unknown'}`);
});

// Log test end
afterEach(function() {
  const status = this.currentTest?.state || 'unknown';
  cy.task('log', `Finished test: ${this.currentTest?.fullTitle() || 'unknown'} - Status: ${status}`);
  
  // Take a screenshot after each test for debugging (even on pass)
  if (status === 'failed') {
    const testName = this.currentTest?.fullTitle().replace(/[^a-z0-9]/gi, '_') || 'unknown';
    cy.screenshot(`after-${testName}`, { capture: 'fullPage' });
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
