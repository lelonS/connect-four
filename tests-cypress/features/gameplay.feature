Feature: Game Play

    Scenario: Win and play again
        Given I am on the main page
        And I enter valid player names
        When the game is played to a win
        And I click on the "Play Again" button
        Then the board is reset
        And the game should start

    Scenario: Draw and play again
        Given I am on the main page
        And I enter valid player names
        When The game is played to a draw
        And I click on the "New Game" button
        Then the board is reset
        And I should be able to enter player names
