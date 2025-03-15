document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const statusDiv = document.getElementById('status');
  const resetButton = document.getElementById('reset');

  // 初期設定：プレイヤーはX（人間）、コンピュータはO
  let board = Array(9).fill(null);
  let currentPlayer = 'X'; // 'X'は人間、'O'はコンピュータ
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

  // 勝利判定：指定のプレイヤーで勝利しているかチェック
  function checkWin(player) {
    return winningCombinations.some(combination => {
      return combination.every(index => board[index] === player);
    });
  }

  // セルクリック時の処理（人間のターンのみ受付）
  function handleCellClick(e) {
    if (!gameActive || currentPlayer !== 'X') {
      return;
    }
    const index = e.target.getAttribute('data-index');
    if (board[index]) {
      return;
    }
    makeMove(index, 'X');

    // 人間の勝利チェック
    if (checkWin('X')) {
      statusDiv.textContent = `プレイヤー X の勝ち！`;
      gameActive = false;
      return;
    }
    // 引き分けチェック
    if (board.every(cell => cell)) {
      statusDiv.textContent = '引き分け！';
      gameActive = false;
      return;
    }

    // コンピュータのターンに切り替え
    currentPlayer = 'O';
    statusDiv.textContent = `コンピュータのターン...`;
    // 少し待ってからコンピュータが動作
    setTimeout(computerMove, 500);
  }

  // コンピュータの動作（ランダムな空セルを選択）
  function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    // 空セルのインデックスを取得
    const emptyIndices = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null);

    // ランダムな空セルに置く
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(randomIndex, 'O');

    // コンピュータの勝利チェック
    if (checkWin('O')) {
      statusDiv.textContent = `コンピュータの勝ち！`;
      gameActive = false;
      return;
    }
    // 引き分けチェック
    if (board.every(cell => cell)) {
      statusDiv.textContent = '引き分け！';
      gameActive = false;
      return;
    }

    // 再び人間のターンに切り替え
    currentPlayer = 'X';
    statusDiv.textContent = `あなたのターン (X)`;
  }

  // 指定インデックスにプレイヤーのマークを配置
  function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) {
      cell.textContent = player;
    }
  }

  // ゲームリセット
  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
      cell.textContent = '';
    });
    statusDiv.textContent = `あなたのターン (X)`;
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  // 初期状態のステータス表示
  statusDiv.textContent = `あなたのターン (X)`;
});
