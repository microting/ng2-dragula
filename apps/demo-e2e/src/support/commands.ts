// ***********************************************
// Custom Cypress commands for ng2-dragula testing
// ***********************************************

declare namespace Cypress {
  interface Chainable {
    /**
     * Drags an element from source to target
     * @example cy.dragAndDrop('[data-testid=source]', '[data-testid=target]')
     */
    dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<Element>;
  }
}

/**
 * Custom command to perform drag and drop operations
 */
Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).first().as('source');
  cy.get(targetSelector).first().as('target');

  cy.get('@source').then((source) => {
    cy.get('@target').then((target) => {
      const dataTransfer = new DataTransfer();

      // Trigger dragstart on source
      cy.wrap(source).trigger('mousedown', { button: 0 });
      cy.wrap(source).trigger('dragstart', { dataTransfer });

      // Trigger dragover and drop on target
      cy.wrap(target).trigger('dragover', { dataTransfer });
      cy.wrap(target).trigger('drop', { dataTransfer });

      // Trigger dragend on source
      cy.wrap(source).trigger('dragend', { dataTransfer });
      cy.wrap(source).trigger('mouseup', { button: 0 });
    });
  });
});
