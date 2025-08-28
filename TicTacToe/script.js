const board = document.getElementById("game-board");
const statusDiv = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const playerX = document.getElementById("player-x");

const playerO = document.getElementById("player-o");

let cells = [];
let currentPlayer = "X";
let gameActive = true;

let boardState = Array(9).fill("");
let winnerPattern = [];

function renderBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.dataset.index = i;
    cell.textContent = boardState[i];

    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);

    cells.push(cell);
  }

  highlightWinner();
}

function handleCellClick(e) {
  const idx = e.target.dataset.index;

  if (!gameActive || boardState[idx]) return;
  boardState[idx] = currentPlayer;

  renderBoard();

  const win = checkWin();

  if (win) {
    statusDiv.textContent = `🎉 Player ${currentPlayer} wins!`;

    gameActive = false;

    highlightWinner(win);
    setActivePlayer(null);

    alert(`Player ${currentPlayer} wins!`);
  } else if (boardState.every((cell) => cell)) {
    statusDiv.textContent = "It's a draw!";

    gameActive = false;

    setActivePlayer(null);
    alert("It's a draw!");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusDiv.textContent = `Player ${currentPlayer}'s turn`;

    setActivePlayer(currentPlayer);
  }
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      winnerPattern = pattern;

      return pattern;
    }
  }
  winnerPattern = [];

  return null;
}

function highlightWinner(pattern = winnerPattern) {
  cells.forEach((cell, idx) => {
    cell.classList.remove("winner");

    if (pattern && pattern.includes(idx)) {
      cell.classList.add("winner");
    }
  });
}

function setActivePlayer(player) {
  playerX.classList.remove("active");
  playerO.classList.remove("active");
  if (player === "X") playerX.classList.add("active");

  if (player === "O") playerO.classList.add("active");
}

function resetGame() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  winnerPattern = [];
  statusDiv.textContent = `Player ${currentPlayer}'s turn`;
  setActivePlayer(currentPlayer);
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);

setActivePlayer(currentPlayer);
renderBoard();
statusDiv.textContent = `Player ${currentPlayer}'s turn`;
