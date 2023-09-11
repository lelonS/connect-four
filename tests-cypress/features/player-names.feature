Feature: Enter player names

  Scenario: Entering no names
    Given I am on the main page
    And no names have been entered
    When I click the "Start Game" button
    Then the game should not start
    And I should be able to enter player names

  Scenario: Entering valid player names

  Scenario: Entering invalid player names

  Scenario: Entering 1 valid player name and 1 invalid player name