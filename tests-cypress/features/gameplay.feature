Feature: Game Play

    Scenario: Win and play again
        Given I am on the main page
        Then I enter player names
        When One player has four crossed cell in a column
        Then The game end and a player wins
        Then Ask for players to play again
        When Player says yes to play again
        Then Reset the board

    Scenario: Draw and play again
        Given I am on the main page
        Then I enter player names
        When All the cells are filled and no player has won
        Then The Game is a Draw
        Then Ask for players to play again
        When Player says yes to play again
        Then Reset the board
