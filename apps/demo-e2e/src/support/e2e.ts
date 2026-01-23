// Import commands.js using ES2015 syntax:
import './commands';

// Capture all browser console logs
Cypress.on('window:before:load', (win) => {
  // Store original console methods
  const originalLog = win.console.log;
  const originalWarn = win.console.warn;
  const originalError = win.console.error;
  const originalInfo = win.console.info;
  const originalDebug = win.console.debug;
  
  // Override console methods to capture logs
  win.console.log = function(...args) {
    cy.task('logBrowserConsole', {
      type: 'log',
      message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
      timestamp: new Date().toISOString()
    }, { log: false });
    originalLog.apply(win.console, args);
  };
  
  win.console.warn = function(...args) {
    cy.task('logBrowserConsole', {
      type: 'warn',
      message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
      timestamp: new Date().toISOString()
    }, { log: false });
    originalWarn.apply(win.console, args);
  };
  
  win.console.error = function(...args) {
    cy.task('logBrowserConsole', {
      type: 'error',
      message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
      timestamp: new Date().toISOString()
    }, { log: false });
    originalError.apply(win.console, args);
  };
  
  win.console.info = function(...args) {
    cy.task('logBrowserConsole', {
      type: 'info',
      message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
      timestamp: new Date().toISOString()
    }, { log: false });
    originalInfo.apply(win.console, args);
  };
  
  win.console.debug = function(...args) {
    cy.task('logBrowserConsole', {
      type: 'debug',
      message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
      timestamp: new Date().toISOString()
    }, { log: false });
    originalDebug.apply(win.console, args);
  };
  
  // Capture uncaught errors
  win.addEventListener('error', (event) => {
    cy.task('logBrowserConsole', {
      type: 'error',
      message: `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      timestamp: new Date().toISOString()
    }, { log: false });
  });
  
  // Capture unhandled promise rejections
  win.addEventListener('unhandledrejection', (event) => {
    cy.task('logBrowserConsole', {
      type: 'error',
      message: `Unhandled promise rejection: ${event.reason}`,
      timestamp: new Date().toISOString()
    }, { log: false });
  });
});

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
  cy.task('log', `========================================`);
});

// Log test end
afterEach(function() {
  const status = this.currentTest?.state || 'unknown';
  cy.task('log', `========================================`);
  cy.task('log', `Finished test: ${this.currentTest?.fullTitle() || 'unknown'} - Status: ${status}`);
  
  // Take a screenshot after each test for debugging (even on pass)
  if (status === 'failed') {
    const testName = this.currentTest?.fullTitle().replace(/[^a-z0-9]/gi, '_') || 'unknown';
    cy.screenshot(`after-${testName}`, { capture: 'fullPage' });
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
