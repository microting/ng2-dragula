# Running Cypress E2E Tests

## Prerequisites

1. Install Cypress binary (if not already installed):
```bash
npx cypress install
```

2. Make sure dependencies are installed:
```bash
yarn install
```

## Running Tests

### Option 1: Interactive Mode (Cypress Test Runner)
```bash
# Open Cypress Test Runner
npm run cypress:open
# or
yarn cypress:open
```

This will open the Cypress GUI where you can:
- Select individual test files to run
- Watch tests run in real-time
- Use Time Travel debugging
- Take screenshots and videos

### Option 2: Headless Mode (CI/CD)
```bash
# Run all e2e tests headlessly
npm run e2e
# or
nx e2e demo-e2e
```

### Option 3: CI Mode with Chrome
```bash
# Run in CI configuration
npm run e2e:ci
# or
nx e2e demo-e2e --configuration=ci
```

## Test Files

All test files are located in `apps/demo-e2e/src/e2e/`:

- `app.cy.ts` - Basic smoke test
- `01-basic-drag.cy.ts` - Basic drag & drop
- `02-events.cy.ts` - Drag events
- `03-spill.cy.ts` - Spill behavior
- `04-revert.cy.ts` - Revert on spill
- `05-copy.cy.ts` - Copy functionality
- `06-copy-model.cy.ts` - Copy with models
- `07-handle.cy.ts` - Handle-based dragging
- `08-click.cy.ts` - Click vs drag
- `09-ngfor.cy.ts` - ngFor integration
- `10-nested.cy.ts` - Nested containers

## Debugging Tests

If tests fail:
1. Check screenshots in `dist/cypress/apps/demo-e2e/screenshots/`
2. Run in interactive mode to see what's happening
3. Use `cy.pause()` in test code to pause execution
4. Use browser DevTools while in interactive mode

## Protractor Tests

The old Protractor tests are still available in `apps/e2e/` and can be kept until Cypress tests are fully verified.
