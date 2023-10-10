Feature: Connecting with invalid parameters

  Background: Setup online test
    Given I am on the online test page
    And "Player1" click on the "Online" button
    And "Player2" click on the "Online" button
    And "Player3" click on the "Online" button

  Scenario: Connecting to full channel
    Given 2 players connect to a unique channel
    When "Player3" connect to the last unique channel
    Then "Player3" should be on the online connect page
    And "Player3" should see the game full message
    And the online game should be in progress

  Scenario: Connecting to channel with duplicate name
    Given "Player1" connect to a unique channel with name "Player1"
    When "Player2" connect to the same channel with name "Player1"
    Then "Player2" should be on the online connect page
    And "Player2" should see an error message
    And "Player1" is waiting for opponent