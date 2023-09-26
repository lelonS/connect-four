Feature: Bot
    Scenario: Bot vs Bot
        Given I am on the main page
        When I pick "Random Bot" in both dropdowns
        And I enter valid player names
        Then the game starts
        And Bot and Bot make move on their turn until the game ends

    Scenario: Bot vs Human
        Given I am on the main page
        When I pick "Random Bot" in first dropdown
        And I enter valid player names
        Then The game starts
        And Bot makes the first move
        And I can make a move