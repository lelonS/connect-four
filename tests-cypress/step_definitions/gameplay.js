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
  const moves = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 4, 4,
    4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6];
  moves.forEach(move => {
    cy.get('.column').eq(move).click();
  });
});

Then('I should be able to enter player names', () => {
  cy.get('.game-info h3').should('contain', 'Enter player names');
  cy.get('input').eq(0).should('exist');
  cy.get('input').eq(1).should('exist');
});

Given('no names have been entered', () => {
  cy.get('input').eq(0).clear();
  cy.get('input').eq(1).clear();
});

When('I click on a column', () => {
  cy.get('.column').eq(0).click();
});

Then('no move is made', () => {
  cy.get('.board .player-1').should('not.exist');
  cy.get('.board .player-2').should('not.exist');
});

Then('the {string} div should have the {string} class', (divClass, otherDivClass) => {
  cy.get(divClass).should('have.class', otherDivClass)
});