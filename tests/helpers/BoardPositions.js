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

  static get winVerticalLeftSide() {
    return {
      name: 'winVerticalLeftSide',
      winnerCoords: [[0, 0], [0, 1], [0, 2], [0, 3]],
      board: [
        [0, 0, 0, 0],
        [1, 1, 1],
        [],
        [],
        [],
        [],
        []
      ]
    }
  }

  static get winHorizontalLeftSide() {
    return {
      name: 'winHorizontalLeftSide',
      winnerCoords: [[0, 0], [1, 0], [2, 0], [3, 0]],
      board: [
        [0, 1],
        [0, 1],
        [0, 1],
        [0],
        [],
        [],
        []
      ]
    }
  }

  static get winDiagonalLeftSide() {
    return {
      name: 'winDiagonalLeftSide',
      winnerCoords: [[0, 0], [1, 1], [2, 2], [3, 3]],
      board: [
        [0, 1],
        [1, 0],
        [1, 1, 0],
        [0, 1, 0, 0],
        [],
        [],
        []
      ]
    }
  }

  static get winVerticalRightSide() {
    return {
      name: 'winVerticalRightSide',
      winnerCoords: [[6, 0], [6, 1], [6, 2], [6, 3]],
      board: [
        [],
        [],
        [],
        [],
        [0],
        [0, 0, 0],
        [1, 1, 1, 1]
      ]
    }
  }

  static get winHorizontalRightSide() {
    return {
      name: 'winHorizontalRightSide',
      winnerCoords: [[3, 0], [4, 0], [5, 0], [6, 0]],
      board: [[0],
      [],
      [],
      [1],
      [1, 0],
      [1, 0],
      [1, 0]
      ]
    }
  }

  static get winDiagonalRightSide() {
    return {
      name: 'winDiagonalRightSide',
      winnerCoords: [[6, 0], [5, 1], [4, 2], [3, 3]],
      board: [
        [],
        [],
        [],
        [0, 1, 0, 1],
        [0, 0, 1],
        [0, 1],
        [1]
      ]
    }
  }

  static get winHorizontalTop() {
    return {
      name: 'winHorizontalTop',
      winnerCoords: [[2, 5], [3, 5], [4, 5], [5, 5]],
      board: [
        [],
        [],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1],
        [0, 0, 1, 0, 0, 1],
        [0, 1, 0, 1, 0, 1],
        []
      ]
    }
  }

  static get winPositions() {
    return [
      BoardPositions.winVerticalLeftSide,
      BoardPositions.winHorizontalLeftSide,
      BoardPositions.winDiagonalLeftSide,
      BoardPositions.winVerticalRightSide,
      BoardPositions.winHorizontalRightSide,
      BoardPositions.winDiagonalRightSide,
      BoardPositions.winHorizontalTop
    ];
  }
}

module.exports = BoardPositions;
