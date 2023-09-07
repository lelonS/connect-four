import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am on the main page', () => {
  cy.visit('/');
});

Then('I see a board', () => {
  cy.get('.board').should('be.visible');
});

Then('I see a sidebar', () => {
  cy.get('.game-sidebar').should('be.visible');
});