class PerfectBot extends Bot {


  getPosString(board) {
    return board.moveHistory.map(move => move.col + 1).join('');
  }

  async getMove(board) {
    const baseUrl = 'https://connect4.gamesolver.org/solve?pos=';
    const posString = this.getPosString(board);
    const url = baseUrl + posString;
    const response = await fetch(url);
    const data = await response.json();

    let bestScore = -Infinity;
    let bestMove = null;
    for (let col = 0; col < 7; col++) {
      const score = data.score[col];
      if (score > bestScore && score !== 100) {
        bestScore = score;
        bestMove = col;
      }
    }
    // console.log('bestMove', bestMove, 'all', data.score);
    return bestMove;
  }
}
