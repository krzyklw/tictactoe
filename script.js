document.addEventListener("DOMContentLoaded", function () {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const scoreElement = document.getElementById("score");
    const resetButton = document.getElementById("reset");
    const clearScoresButton = document.getElementById("clear-scores");
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameOver = false;
    let playerScore = 0;
    let computerScore = 0;
    let ties = 0;

    function checkWin(player) {
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    function checkTie() {
        return board.every((cell) => cell !== "");
    }

    function updateGame() {
        if (checkWin(currentPlayer)) {
            message.innerText = `${currentPlayer} wins!`;
            if (currentPlayer === "X") {
                playerScore++;
            } else {
                computerScore++;
            }
            if (currentPlayer === "X") {
                document.getElementById("userWinSound").play();
            }
            else if (currentPlayer === "O") {
                document.getElementById("computerWinSound").play();
            }
            gameOver = true;
        } else if (checkTie()) {
            message.innerText = "It's a tie!";
            ties++;
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            message.innerText = `${currentPlayer}'s turn`;
            if (currentPlayer === "O" && !gameOver) {
                setTimeout(() => {
                    computerMove();
                }, 200);
            }
    
            scoreElement.innerText = `Player: ${playerScore} Computer: ${computerScore} Ties: ${ties}`;
        }
    }    

    function cellClick(index) {
        if (!gameOver && board[index] === "") {
          board[index] = currentPlayer;
          const imageSrc = currentPlayer === "X" ? "close.png" : "open.png";
          cells[index].innerHTML = `<img src="${imageSrc}" alt="${currentPlayer}" class="invert-color">`;
          updateGame();
          playRandomSound();
        }
      }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameOver = false;
        message.innerText = `Player ${currentPlayer}'s turn`;
        cells.forEach((cell) => (cell.innerHTML = ""));
    }

    function clearScores() {
        playerScore = 0;
        computerScore = 0;
        ties = 0;
        scoreElement.innerText = `Player: ${playerScore}, Computer: ${computerScore}, Ties: ${ties}`;
    }

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => cellClick(index));
    });

    resetButton.addEventListener("click", resetGame);
    clearScoresButton.addEventListener("click", clearScores);

    message.innerText = `Player ${currentPlayer}'s turn`;

    function computerMove() {
        const bestMove = findBestMove();
        board[bestMove] = "O";
        cells[bestMove].innerHTML = `<img src="open.png" alt="O" class="invert-color">`;
        updateGame();
        playRandomSound();
      }

    function findBestMove() {
        let bestMove = -1;
        let bestScore = -Infinity;
        let alpha = -Infinity;
        let beta = Infinity;
        
        // Prioritize center and corners first
        const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
        
        // First, check if we can win in one move
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                if (checkWin("O")) {
                    board[i] = "";
                    return i;
                }
                board[i] = "";
            }
        }
        
        // Then check if we need to block opponent's winning move
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                if (checkWin("X")) {
                    board[i] = "";
                    return i;
                }
                board[i] = "";
            }
        }

        // If no immediate win or block needed, use strategic moves
        for (const i of preferredMoves) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, 0, false, alpha, beta);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break;
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing, alpha, beta) {
        const result = checkWinner(board);
        if (result !== null) {
            return result;
        }
        
        // Add depth limit to prevent unnecessary deep searches
        if (depth >= 6) {
            return evaluatePosition(board);
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false, alpha, beta);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true, alpha, beta);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break; // Alpha-beta pruning
                }
            }
            return bestScore;
        }
    }

    function evaluatePosition(board) {
        // Simple position evaluation
        let score = 0;
        // Value center position
        if (board[4] === "O") score += 0.3;
        if (board[4] === "X") score -= 0.3;
        
        // Value corners
        const corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (board[corner] === "O") score += 0.2;
            if (board[corner] === "X") score -= 0.2;
        }
        
        return score;
    }

    function checkWinner(board) {
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] === board[b] && board[b] === board[c]) {
                if (board[a] === "X") {
                    return -1;
                } else if (board[a] === "O") {
                    return 1;
                }
            }
        }
        if (board.includes("")) {
            return null;
        }
        return 0;
    }
});

const sounds = [
    document.getElementById("sound1"),
    document.getElementById("sound2"),
    document.getElementById("sound3"),
    document.getElementById("sound4"),
  ];

  function playRandomSound() {
    const randomIndex = Math.floor(Math.random() * sounds.length);
    sounds[randomIndex].play();
  }
