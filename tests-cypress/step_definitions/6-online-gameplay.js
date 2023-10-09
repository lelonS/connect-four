import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { getUniqueChannel } from "../support/channel-gen";

Given('I am on the online test page', () => {
  cy.visit('/../tests-cypress/test-online.html');
});

Given('{string} click on the {string} button', (player, text) => {
  cy.getIframeBody(player).find('button').contains(text).click();
});

Given('2 players connect to a unique channel', () => {
  const channel = getUniqueChannel();
  // Player1
  cy.getIframeBody('Player1').find('input[placeholder="Channel"]').type(channel);
  cy.getIframeBody('Player1').find('input[placeholder="Player"]').type('Player1');
  cy.getIframeBody('Player1').find('button').contains('Connect').click();
  // Player2
  cy.getIframeBody('Player2').find('input[placeholder="Player"]').type('Player2');
  cy.getIframeBody('Player2').find('input[placeholder="Channel"]').type(channel);
  cy.getIframeBody('Player2').find('button').contains('Connect').click();
});

Given('the online game starts', () => {
  cy.getIframeBody('Player1').find('h3').should('contain', 'turn');
  cy.getIframeBody('Player2').find('h3').should('contain', 'turn');
});

When('the online game is played to a win', () => {
  // Player1 wins
  cy.getIframeBody('Player1').find('.column').eq(0).click();
  for (let i = 0; i < 3; i++) {
    // Wait for the move to be made on the other player's board
    cy.getIframeBody('Player2').find('h3').should('contain', 'Player2\'s turn');
    cy.getIframeBody('Player2').find('.column').eq(1).click();
    // Wait for the move to be made on the other player's board
    cy.getIframeBody('Player1').find('h3').should('contain', 'Player1\'s turn');
    cy.getIframeBody('Player1').find('.column').eq(0).click();
  }
});

Then('{string} should be on the online connect page', (player) => {
  cy.getIframeBody(player).find('h3').should('contain', 'Enter name and channel');
});

Then('{string} should see the other player disconnected message', (player) => {
  cy.getIframeBody(player).find('.info-text').should('contain', 'Opponent left the game. Try a different channel');
});

Given('{string} connect to the channel {string}', (player, channel) => {
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(player);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(channel);
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

Given('{string} is waiting for opponent', (player) => {
  cy.getIframeBody(player).find('h3').should('contain', 'Waiting for opponent');
});

When('{string} click on the a column', (player) => {
  cy.getIframeBody(player).find('.column').eq(0).click();
});

Then('no move is made in the online game', () => {
  cy.getIframeBody('Player1').find('.board .player-1').should('not.exist');
  cy.getIframeBody('Player1').find('.board .player-2').should('not.exist');
  cy.getIframeBody('Player2').find('.board .player-1').should('not.exist');
  cy.getIframeBody('Player2').find('.board .player-2').should('not.exist');
});

Given('it is {string} turn in the online game', (playerName) => {
  cy.getIframeBody('Player1').find('h3').should('contain', playerName + '\'s turn');
  cy.getIframeBody('Player2').find('h3').should('contain', playerName + '\'s turn');
});