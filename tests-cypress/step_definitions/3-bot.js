import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When('I pick {string} in both dropdowns', (a) => {
  cy.get('.game-info select').eq(0).select(a);
  cy.get('.game-info select').eq(1).select(a);
});

Then('the game starts', () => {
  // TODO: implement step
});

Then('Bot and Bot make moves on their turn until the game ends', () => {
  // TODO: implement step
});

When('I pick {string} in first dropdown', (a) => {
  // TODO: implement step
});

Then('The game starts', () => {
  // TODO: implement step
});

Then('a move has been made by {string}', (a) => {
  // TODO: implement step
});

Then('I can make a move', () => {
  // TODO: implement step
});