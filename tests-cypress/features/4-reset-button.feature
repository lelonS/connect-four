Feature: Reset button

  Scenario: Reset button resets the board
    Given I am on the main page
    When I enter valid player names
    And I click on the "Reset Game" button
    Then the board is reset
    And I should be able to enter player names

  Scenario: Reset button for bot vs bot
    Given I am on the main page
    When I pick "random-bot" in both dropdowns
    And I enter valid player names
    And I click on the "Reset Game" button
    And I wait for "2000" miliseconds
    Then the board is reset
    And I should be able to enter player names