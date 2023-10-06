import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { getUniqueChannel, getLastUniqueChannel } from "../support/channel-gen";

When('{string} connect to a unique channel as a {string}', (player, playerType) => {
  const channel = getUniqueChannel();
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(player);
  cy.getIframeBody(player).find('.game-info select').select(playerType);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(channel);
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

When('{string} connect to the last unique channel as a {string}', (player, playerType) => {
  const channel = getLastUniqueChannel();
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(player);
  cy.getIframeBody(player).find('.game-info select').select(playerType);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(channel);
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

Then('both online bots make atleast 2 moves', () => {
  cy.getIframeBody('Player1').find('.board .player-1', { timeout: 10000 }).should('have.length.gte', 2);
  cy.getIframeBody('Player1').find('.board .player-2', { timeout: 10000 }).should('have.length.gte', 2);

  cy.getIframeBody('Player2').find('.board .player-1', { timeout: 10000 }).should('have.length.gte', 2);
  cy.getIframeBody('Player2').find('.board .player-2', { timeout: 10000 }).should('have.length.gte', 2);
});