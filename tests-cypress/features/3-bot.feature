Feature: Bot games

  Scenario: Bot vs Bot
    Given I am on the main page
    And I click on the "Local" button
    When I pick "random-bot" in both dropdowns
    And I click on the "Start" button
    Then the game should start
    And both bots make atleast 2 moves

  Scenario: Bot vs Human
    Given I am on the main page
    And I click on the "Local" button
    When I pick "random-bot" in first dropdown
    And I click on the "Start" button
    Then the game should start
    And a move has been made by ".player-1"
    And I can make a move as ".player-2"