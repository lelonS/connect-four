class Player {
  constructor(name) {
    this.name = name;
  }

  setNameFromInput(plrNumber) {
    const name = prompt('Enter name for Player ' + plrNumber + ':');
    this.name = name ? name : 'Player ' + plrNumber;
  }
}