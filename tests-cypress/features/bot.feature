Feature: Bot 
    Scenario: Bot vs Bot
        Given I am on the main page
        And I pick "Random Bot" in both dropdown
        Then I enter valid player names
        Then The game is played to an end
    
    Scenario: Bot vs Human
        Given I am on the main page
        And I pick "Random both" in first dropdown
        Then I enter valid player names
        Then The game is played to an end