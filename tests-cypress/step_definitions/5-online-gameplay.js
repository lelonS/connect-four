import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

function getIframeDocument(player) {
  // Last character is player number (Player1, Player2, Player3)
  const frameIndex = +player.split().pop() - 1;


}

Given('I am on the online test page', () => {
  cy.visit('/../tests-cypress/test-online.html');
});

Given('{string} click on the {string} button', (player, text) => {
  cy.getIframeBody(player).find('button').contains(text).click();
});

Given('2 players connect to the channel {string}', (a) => {
  // TODO: implement step
});

Given('the online game starts', () => {
  // TODO: implement step
});

When('the online game is played to a win', () => {
  // TODO: implement step
});

Then('{string} should be on the online connect page', (a) => {
  // TODO: implement step
});

Then('{string} should see the other player disconnected message', (a) => {
  // TODO: implement step
});

Given('{string} connect to the channel {string}', (a, b) => {
  // TODO: implement step
});

Given('{string} is waiting for opponent', (a) => {
  // TODO: implement step
});

When('{string} click on the a column', (a) => {
  // TODO: implement step
});

Then('no move is made in the online game', () => {
  // TODO: implement step
});