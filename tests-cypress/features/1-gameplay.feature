Feature: Game Play

  Scenario: Win and play again
    Given I am on the main page
    And I click on the "Local" button
    And I enter valid player names
    When the game is played to a win
    And I click on the "Play Again" button
    Then the board is reset
    And the game should start

  Scenario: Draw and start new game
    Given I am on the main page
    And I click on the "Local" button
    And I enter valid player names
    When the game is played to a draw
    And I click on the "New Game" button
    Then the board is reset
    And I should be able to enter player names

  Scenario: Trying to play before entering names
    Given I am on the main page
    And I click on the "Local" button
    And no names have been entered
    When I click on a column
    Then no move is made
    And the ".game-sidebar" div should have the "error-animation" class
    And I should be able to enter player names