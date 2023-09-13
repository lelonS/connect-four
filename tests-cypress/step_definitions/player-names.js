import { When, Then } from "@badeball/cypress-cucumber-preprocessor";


Then('the game should not start', () => {
  cy.get('.game-info h3').should('not.contain', 'turn');
});

When('I enter {string} in the {string} field', (text, fieldPlaceholder) => {
  cy.get(`.game-info input[placeholder = '${fieldPlaceholder}']`).type(text);
});

Then('the player name input fields should be empty', () => {
  cy.get('.game-info input').eq(0).should('have.value', '');
  cy.get('.game-info input').eq(1).should('have.value', '');
});

Then('{string} should be in the {string} field', (text, fieldPlaceholder) => {
  cy.get(`.game-info input[ placeholder = '${fieldPlaceholder}']`).should('have.value', text);
});

Then('the {string} field should be empty', (fieldPlaceholder) => {
  cy.get(`.game-info input[ placeholder = '${fieldPlaceholder}']`).should('have.value', '');
});