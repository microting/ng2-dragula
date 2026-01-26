// Import commands.js using ES2015 syntax:
import './commands';

// Collect browser console logs in a buffer for later processing
let consoleLogs: Array<{type: string; message: string; timestamp: string}> = [];

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
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    consoleLogs.push({
      type: 'log',
      message,
      timestamp: new Date().toISOString()
    });
    originalLog.apply(win.console, args);
  };
  
  win.console.warn = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    consoleLogs.push({
      type: 'warn',
      message,
      timestamp: new Date().toISOString()
    });
    originalWarn.apply(win.console, args);
  };
  
  win.console.error = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    consoleLogs.push({
      type: 'error',
      message,
      timestamp: new Date().toISOString()
    });
    originalError.apply(win.console, args);
  };
  
  win.console.info = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    consoleLogs.push({
      type: 'info',
      message,
      timestamp: new Date().toISOString()
    });
    originalInfo.apply(win.console, args);
  };
  
  win.console.debug = function(...args) {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    consoleLogs.push({
      type: 'debug',
      message,
      timestamp: new Date().toISOString()
    });
    originalDebug.apply(win.console, args);
  };
  
  // Capture uncaught errors
  win.addEventListener('error', (event) => {
    consoleLogs.push({
      type: 'error',
      message: `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Capture unhandled promise rejections
  win.addEventListener('unhandledrejection', (event) => {
    consoleLogs.push({
      type: 'error',
      message: `Unhandled promise rejection: ${event.reason}`,
      timestamp: new Date().toISOString()
    });
  });
});

// Log test start
beforeEach(function() {
  cy.log(`Starting test: ${this.currentTest?.fullTitle() || 'unknown'}`);
});

// Log test end and save console logs
afterEach(function() {
  const status = this.currentTest?.state || 'unknown';
  cy.log(`Finished test: ${this.currentTest?.fullTitle() || 'unknown'} - Status: ${status}`);
  
  // Save collected console logs to file
  if (consoleLogs.length > 0) {
    cy.task('logBrowserConsole', consoleLogs, { log: false }).then(() => {
      consoleLogs = []; // Clear the buffer
    });
  }
  
  // Take a screenshot after each test for debugging (even on pass)
  if (status === 'failed') {
    const testName = this.currentTest?.fullTitle().replace(/[^a-z0-9]/gi, '_') || 'unknown';
    cy.screenshot(`after-${testName}`, { capture: 'fullPage' });
  }
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
