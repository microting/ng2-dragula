import { defineConfig } from 'cypress';

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
    defaultCommandTimeout: 10000,
    // Add setup for better debugging
    setupNodeEvents(on, config) {
      // Log test failures with more detail
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
      return config;
    },
  },
});
