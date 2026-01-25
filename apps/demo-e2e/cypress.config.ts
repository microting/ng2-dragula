import { defineConfig } from 'cypress';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/e2e.ts',
    fixturesFolder: 'src/fixtures',
    videosFolder: '../../dist/cypress/apps/demo-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/demo-e2e/screenshots',
    video: true, // Enable video recording for debugging
    screenshotOnRunFailure: true,
    videoCompression: 32, // Compress videos to save space
    trashAssetsBeforeRuns: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 30000, // Increase timeout for Docker-based CI
    pageLoadTimeout: 60000, // Increase page load timeout
    requestTimeout: 30000, // Increase request timeout
    responseTimeout: 30000, // Increase response timeout
    // Add setup for better debugging
    setupNodeEvents(on, config) {
      const logsDir = path.join(__dirname, '../../dist/cypress/apps/demo-e2e/logs');
      
      // Ensure logs directory exists
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const browserLogFile = path.join(logsDir, 'browser-console.log');
      const testLogFile = path.join(logsDir, 'test-execution.log');
      
      // Log test failures with more detail
      on('task', {
        log(message) {
          const timestamp = new Date().toISOString();
          const logMessage = `[${timestamp}] ${message}\n`;
          console.log(message);
          // Write to file
          fs.appendFileSync(testLogFile, logMessage);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
        // Task to log browser console messages (receives an array of log entries)
        logBrowserConsole(logs) {
          if (Array.isArray(logs)) {
            logs.forEach(({ type, message, timestamp }) => {
              const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
              console.log(`Browser Console [${type}]:`, message);
              fs.appendFileSync(browserLogFile, logMessage);
            });
          }
          return null;
        }
      });
      
      // Capture browser console logs
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // Enable verbose logging
          launchOptions.args.push('--enable-logging');
          launchOptions.args.push('--v=1');
        }
        return launchOptions;
      });
      
      return config;
    },
  },
});
