import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


Then('I should be able to choose local or online game', () => {
  cy.get('button').contains('Local').should('exist');
  cy.get('button').contains('Online').should('exist');
});