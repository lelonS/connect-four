Feature: Game Play

    Scenario: Win and play again
        Given I am on the main page
        Then I enter player names
        When One player has four crossed cell in a column
        Then The game end and a player wins
        When The game end
        Then Ask for players to play again
        When Player says yes to play again
        Then Reset the board
