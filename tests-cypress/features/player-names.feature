Feature: Enter player names

  Scenario: Entering no names
    Given I am on the main page
    And no names have been entered
    When I click the "Start Game" button
    Then the game should not start
    And I should be able to enter player names

  Scenario: Entering valid player names
    Given I am on the main page
    And no names have been entered
    When I enter "Alice" in the "Player 1" field
    And I enter "Bob" in the "Player 2" field
    And I click the "Start Game" button
    Then the game should start

  Scenario: Entering invalid player names
    Given I am on the main page
    And no names have been entered
    When I enter "^?/" in the "Player 1" field
    And I enter "invalid name" in the "Player 2" field
    And I click the "Start Game" button
    Then the game should not start
    And I should be able to enter player names
    And the player name input fields should be empty

  Scenario: Entering 1 valid player name and 1 invalid player name
    Given I am on the main page
    And no names have been entered
    When I enter "Alice" in the "Player 1" field
    And I enter "invalid name" in the "Player 2" field
    And I click the "Start Game" button
    Then the game should not start
    And I should be able to enter player names
    And "Alice" should be in the "Player 1" field
    And the "Player 2" field should be empty