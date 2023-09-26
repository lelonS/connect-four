import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When('I pick {string} in both dropdowns', (playerType) => {
  cy.get('.game-info select').eq(0).select(playerType);
  cy.get('.game-info select').eq(1).select(playerType);
});

Then('the game starts', () => {
  // TODO: implement step
});

Then('Bot and Bot make moves on their turn until the game ends', () => {
  // TODO: implement step
});

When('I pick {string} in first dropdown', (playerType) => {
  // TODO: implement step
});

Then('The game starts', () => {
  // TODO: implement step
});

Then('a move has been made by {string}', (playerClass) => {
  // TODO: implement step
});

Then('I can make a move', () => {
  // TODO: implement step
});