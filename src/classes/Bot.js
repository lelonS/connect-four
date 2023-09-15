class Bot extends Player {
  constructor() {
    super('bot', Math.random());
  }

  /* Get the next move for bot
   * @param {Board} board
   * @returns number
  */
  getMove(_board) {
    return 0;
  }
}