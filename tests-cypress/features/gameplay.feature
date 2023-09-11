Feature: Game Play

    Scenario: Win and play again
        Given I am on the main page
         And I enter player names
         When the game is played to a win
         And I click on the "Play Again" button
        Then the board is reset

    Scenario: Draw and play again
        Given I am on the main page
        And   I enter player names
        When  The game is played to a draw
        And  I click on the "New Game" button
        Then  the board is reset 
        And   I should be able to enter player names
