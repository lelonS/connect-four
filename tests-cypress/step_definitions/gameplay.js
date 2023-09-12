import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am on the main page', () => {
  cy.visit('/');
});

Given('I enter valid player names', () => {
  cy.get('input').eq(0).type('Alice');
  cy.get('input').eq(1).type('Bob');
  cy.get('button').click();
});

When('the game is played to a win', () => {
  const moves = [0, 1, 0, 1, 0, 1, 0];
  moves.forEach(move => {
    cy.get('.column').eq(move).click();
  });
});

When('I click on the {string} button', (text) => {
  cy.get('button').contains(text).click();
});

Then('the board is reset', () => {
  cy.get('.board .player-1').should('not.exist');
  cy.get('.board .player-2').should('not.exist');
});

Then('the game should start', () => {
  // If game started, there should be a message about whose turn it is
  cy.get('.game-info h3').should('contain', 'turn');
});

When('The game is played to a draw', () => {
  // TODO: implement step
});

Then('I should be able to enter player names', () => {
  // TODO: implement step
});

Given('no names have been entered', () => {
  // TODO: implement step
});

When('I click on a column', () => {
  // TODO: implement step
});

Then('no move is made', () => {
  // TODO: implement step
});

Then('the {string} div should have the {string} class', (divClass, otherDivClass) => {
  // TODO: implement step
});