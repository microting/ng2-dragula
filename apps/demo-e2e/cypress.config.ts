import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'nx run demo:serve',
        production: 'nx run demo:serve:production',
      },
      ciWebServerCommand: 'nx run demo:serve',
    }),
    baseUrl: 'http://localhost:4200',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/e2e.ts',
    fixturesFolder: 'src/fixtures',
    videosFolder: '../../dist/cypress/apps/demo-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/demo-e2e/screenshots',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
  },
});
