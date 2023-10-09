Feature: Online bot games
  To test this we use a page with 3 iframes. The first one is Player1, the second is Player2, and the third one is to test what happens when a third player joins.
  Player1 and Player2 will be the players playing

  Background: Setup online test
    Given I am on the online test page
    And "Player1" click on the "Online" button
    And "Player2" click on the "Online" button
    And "Player3" click on the "Online" button

  Scenario: Online bot game
    When "Player1" connect to a unique channel as a "smart-bot"
    And "Player2" connect to the last unique channel as a "random-bot"
    Then the online game starts
    And both online bots make atleast 2 moves