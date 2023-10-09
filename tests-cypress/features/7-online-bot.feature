Feature: Online bot games

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