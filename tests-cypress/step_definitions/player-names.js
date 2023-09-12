import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When('I click the {string} button', (text) => {
  switch (text) {
    case 'Start Game': {
      cy.get('button').click();
      break;
    }
    default: {
      cy.get(text).click();
    }
  }
});

Then('the game should not start', () => {
  cy.get('.game-info h3').should('not.contain', 'turn');
});

When('I enter {string} in the {string} field', (text, b) => {
  cy.get(`input[placeholder = '${b}']`).type(text);
});

Then('the player name input fields should be empty', () => {
  cy.get('input').eq(0).should('have.value', '');
  cy.get('input').eq(1).should('have.value', '');
});

Then('{string} should be in the {string} field', (text, b) => {
  cy.get(`input[ placeholder = '${b}']`).should('have.value', text);
});

Then('the {string} field should be empty', (a) => {
  cy.get(`input[ placeholder = '${a}']`).should('have.value', '');
});