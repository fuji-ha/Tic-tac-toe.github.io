document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const statusDiv = document.getElementById('status');
  const resetButton = document.getElementById('reset');

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

  function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (!gameActive || board[index]) {
      return;
    }
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
      statusDiv.textContent = `プレイヤー ${currentPlayer} の勝ち！`;
      gameActive = false;
      return;
    }

    if (board.every(cell => cell)) {
      statusDiv.textContent = '引き分け！';
      gameActive = false;
      return;
    }

    // プレイヤー交代
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `現在のプレイヤー: ${currentPlayer}`;
  }

  function checkWin() {
    return winningCombinations.some(combination => {
      return combination.every(index => board[index] === currentPlayer);
    });
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
      cell.textContent = '';
    });
    statusDiv.textContent = `現在のプレイヤー: ${currentPlayer}`;
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  // 初期状態のステータス表示
  statusDiv.textContent = `現在のプレイヤー: ${currentPlayer}`;
});
