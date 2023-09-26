Feature: Bot
    Scenario: Bot vs Bot
        Given I am on the main page
        When I pick "random-bot" in both dropdowns
        And I enter valid player names
        Then the game should start
        And Bot and Bot make moves on their turn until the game ends

    Scenario: Bot vs Human
        Given I am on the main page
        When I pick "random-bot" in first dropdown
        And I enter valid player names
        Then the game should start
        And a move has been made by ".player-1"
        And I can make a move as ".player-2"