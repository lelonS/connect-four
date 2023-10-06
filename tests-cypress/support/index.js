Cypress.Commands.add('getIframeBody', (player) => {
  // get the iframe > document > body
  // and retry until the body element is not empty
  cy.log('getIframeBody')

  // Last character is player number (Player1, Player2, Player3)
  const frameIndex = +player.split('').pop() - 1;

  return cy
    .get('iframe', { log: false })
    .eq(frameIndex, { log: false })
    .its('0.contentDocument.body', { log: false }).should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then((body) => cy.wrap(body, { log: false }))
})