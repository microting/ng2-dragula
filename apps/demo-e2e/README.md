# Demo E2E Tests

This directory contains Cypress end-to-end tests for the ng2-dragula demo application.

## Running Tests

### Interactive Mode (Cypress GUI)
```bash
npm run cypress:open
# or
yarn cypress:open
```

### Headless Mode
```bash
npm run e2e
# or
nx e2e demo-e2e
```

### CI Mode
```bash
npm run e2e:ci
# or
nx e2e demo-e2e --configuration=ci
```

## Test Structure

The tests are organized by feature:

- `app.cy.ts` - Basic smoke tests (migrated from Protractor)
- `01-basic-drag.cy.ts` - Basic drag and drop functionality
- `02-events.cy.ts` - Drag and drop events
- `03-spill.cy.ts` - Spill behavior (removeOnSpill)
- `04-revert.cy.ts` - Revert on spill behavior
- `05-copy.cy.ts` - Copy functionality
- `06-copy-model.cy.ts` - Copy with model synchronization
- `07-handle.cy.ts` - Handle-based dragging
- `08-click.cy.ts` - Click vs drag distinction
- `09-ngfor.cy.ts` - ngFor integration
- `10-nested.cy.ts` - Nested containers

## Custom Commands

Custom Cypress commands are defined in `src/support/commands.ts`:

- `cy.dragAndDrop(sourceSelector, targetSelector)` - Performs drag and drop operation

## Note on Protractor

The original Protractor e2e tests in `apps/e2e/` are kept for backward compatibility until Cypress tests are fully verified. Once Cypress tests are stable, the Protractor tests can be removed.
