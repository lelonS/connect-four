Feature: Online Game Play
  As a player I want to play online with another player so that I can play with my friends. To test this
  we use a page with 3 iframes. The first one is Player1, the second is Player2, and the third one is to test what happens when a third player joins.
  Player1 and Player2 will be the players playing

  Background: Setup online test
    Given I am on the online test page
    And "Player1" click on the "Online" button
    And "Player2" click on the "Online" button
    And "Player3" click on the "Online" button

  Scenario: Win and play again
    Given 2 players connect to a unique channel
    And the online game starts
    When the online game is played to a win
    And "Player1" click on the "Play Again" button
    Then the online game starts

  Scenario: Win and start new game
    Given 2 players connect to a unique channel
    And the online game starts
    When the online game is played to a win
    And "Player2" click on the "New Game" button
    Then "Player2" should be on the online connect page
    And "Player1" should be on the online connect page
    And "Player1" should see the other player disconnected message
    And the boards should be reset

  Scenario: Trying to play before second player is entered
    Given "Player1" connect to a unique channel
    And "Player1" is waiting for opponent
    When "Player1" click on a column
    Then no move is made in the online game

  Scenario: Trying to play when not your turn
    Given 2 players connect to a unique channel
    And the online game starts
    And it is "Player1" turn in the online game
    When "Player2" click on a column
    Then no move is made in the online game

  Scenario: Disconnecting before game is over
    Given 2 players connect to a unique channel
    And the online game starts
    And it is "Player1" turn in the online game
    When "Player1" click on a column
    And "Player2" click on the "Disconnect" button
    Then "Player2" should be on the online connect page
    And "Player1" should be on the online connect page
    And "Player1" should see the other player disconnected message
    And the boards should be reset