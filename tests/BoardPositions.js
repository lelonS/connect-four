class BoardPositions {
  static get empty() {
    return {
      turn: 0,
      board: [[], [], [], [], [], [], []]
    };
  }
  static get fullDraw() {
    return {
      turn: 0,
      board: [
        [0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1]]
    };
  }
  static get lastMoveCol6Win() {
    // lastMoveWinBoard, turn = 1, col = 6
    return {
      turn: 1,
      board: [
        [0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1]]
    };
  }

}

module.exports = BoardPositions;
