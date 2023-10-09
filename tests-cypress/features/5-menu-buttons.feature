Feature: Menu buttons

  Scenario: Main menu from local
    Given I am on the main page
    When I click on the "Local" button
    And I click on the "Main Menu" button
    Then I should be able to choose local or online game

  Scenario: Main menu from online
    Given I am on the main page
    When I click on the "Online" button
    And I click on the "Main Menu" button
    Then I should be able to choose local or online game