import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When('I wait for {string} miliseconds', (ms) => {
  cy.wait(+ms);
});