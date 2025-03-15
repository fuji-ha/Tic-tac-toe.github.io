document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const statusDiv = document.getElementById('status');
  const resetButton = document.getElementById('reset');

  // 初期設定：人間はX、コンピュータはO
  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // 指定プレイヤーが勝利しているか、指定の盤面状態でチェック
  function checkWinFor(boardState, player) {
    return winningCombinations.some(combination => {
      return combination.every(index => boardState[index] === player);
    });
  }

  // 人間のクリック処理
  function handleCellClick(e) {
    if (!gameActive || currentPlayer !== 'X') return;
    const index = e.target.getAttribute('data-index');
    if (board[index]) return;
    makeMove(index, 'X');

    if (checkWinFor(board, 'X')) {
      statusDiv.textContent = 'プレイヤー X の勝ち！';
      gameActive = false;
      return;
    }
    if (board.every(cell => cell !== null)) {
      statusDiv.textContent = '引き分け！';
      gameActive = false;
      return;
    }

    currentPlayer = 'O';
    statusDiv.textContent = 'コンピュータのターン...';
    setTimeout(computerMove, 500);
  }

  // Minimaxアルゴリズムで評価値を計算
  function minimax(newBoard, isMaximizing) {
    if (checkWinFor(newBoard, 'O')) return 10;
    if (checkWinFor(newBoard, 'X')) return -10;
    if (newBoard.every(cell => cell !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'O';
          let score = minimax(newBoard, false);
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'X';
          let score = minimax(newBoard, true);
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // コンピュータの動作：Minimaxで最善手を探索して実行
  function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    if (move !== undefined) {
      makeMove(move, 'O');
    }

    if (checkWinFor(board, 'O')) {
      statusDiv.textContent = 'コンピュータの勝ち！';
      gameActive = false;
      return;
    }
    if (board.every(cell => cell !== null)) {
      statusDiv.textContent = '引き分け！';
      gameActive = false;
      return;
    }

    currentPlayer = 'X';
    statusDiv.textContent = 'あなたのターン (X)';
  }

  // 指定インデックスにプレイヤーのマークを配置
  function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) {
      cell.textContent = player;
    }
  }

  // ゲームのリセット
  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    statusDiv.textContent = 'あなたのターン (X)';
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  statusDiv.textContent = 'あなたのターン (X)';
});
