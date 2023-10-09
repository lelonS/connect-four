Feature: Enter player names

  Scenario: Entering no names
    Given I am on the main page
    And I click on the "Local" button
    And no names have been entered
    When I click on the "Start" button
    Then the game should start

  Scenario: Entering valid player names
    Given I am on the main page
    And I click on the "Local" button
    And no names have been entered
    When I enter "Alice" in the "Player1" field
    And I enter "Bob" in the "Player2" field
    And I click on the "Start" button
    Then the game should start

  Scenario: Entering invalid player names
    Given I am on the main page
    And I click on the "Local" button
    And no names have been entered
    When I enter "^?/" in the "Player1" field
    And I enter "invalid name" in the "Player2" field
    And I click on the "Start" button
    Then the game should not start
    And I should be able to enter player names
    And the player name input fields should be empty

  Scenario: Entering 1 valid player name and 1 invalid player name
    Given I am on the main page
    And I click on the "Local" button
    And no names have been entered
    When I enter "Alice" in the "Player1" field
    And I enter "invalid name" in the "Player2" field
    And I click on the "Start" button
    Then the game should not start
    And I should be able to enter player names
    And "Alice" should be in the "Player1" field
    And the "Player2" field should be empty

  Scenario: Entering invalid online name
    Given I am on the main page
    And I click on the "Online" button
    When I enter "invalid name" in the "Player" field
    And I click on the "Connect" button
    Then the game should not start
    And I should be able to enter player name and channel
    And the "Player" field should be empty

  Scenario: Entering no online name:
    Given I am on the main page
    And I click on the "Online" button
    When I enter "channel" in the "Channel" field
    And I click on the "Connect" button
    And I should be able to enter player name and channel