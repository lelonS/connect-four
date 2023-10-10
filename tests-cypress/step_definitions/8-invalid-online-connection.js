import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { getUniqueChannel, getLastUniqueChannel } from "../support/channel-gen";

When('{string} connect to the last unique channel', (player) => {
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(player);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(getLastUniqueChannel());
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

Then('{string} should see the game full message', (player) => {
  cy.getIframeBody(player).find('.info-text').should('contain', 'Game full. Try a different channel');
});

Then('the online game should be in progress', () => {
  cy.getIframeBody('Player1').find('h3').should('contain', 'turn');
  cy.getIframeBody('Player2').find('h3').should('contain', 'turn');
});

Given('{string} connect to a unique channel with name {string}', (player, name) => {
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(name);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(getUniqueChannel());
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

When('{string} connect to the same channel with name {string}', (player, name) => {
  cy.getIframeBody(player).find('input[placeholder="Player"]').type(name);
  cy.getIframeBody(player).find('input[placeholder="Channel"]').type(getLastUniqueChannel());
  cy.getIframeBody(player).find('button').contains('Connect').click();
});

Then('{string} should see an error message', (player) => {
  cy.getIframeBody(player).find('.info-text').should('contain', 'Error: Try a different name or channel');
});