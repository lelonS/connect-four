import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When('I pick {string} in both dropdowns', (playerType) => {
  cy.get('.game-info select').eq(0).select(playerType);
  cy.get('.game-info select').eq(1).select(playerType);
});

Then('Bot and Bot make moves on their turn until the game ends', () => {
  cy.get('.game-result', { timeout: 60000 }).should('exist');
});

When('I pick {string} in first dropdown', (playerType) => {
  cy.get('.game-info select').eq(0).select(playerType);
});

Then('a move has been made by {string}', (playerClass) => {
  cy.get('.board ' + playerClass).should('exist');
});

Then('I can make a move as {string}', (playerClass) => {
  cy.get('.board .column').eq(0).click();
  cy.get('.board ' + playerClass).should('exist');
});