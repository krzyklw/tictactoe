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
                }, 300);
            }
        }

        scoreElement.innerText = `Player: ${playerScore} Computer: ${computerScore} Ties: ${ties}`;
    }

    function cellClick(index) {
        if (!gameOver && board[index] === "") {
            board[index] = currentPlayer;
            const imageSrc = currentPlayer === "X" ? "close.png" : "open.png";
            cells[index].innerHTML = `<img src="${imageSrc}" alt="${currentPlayer}" class="invert-color">`;
            updateGame();
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
    }

    function findBestMove() {
        let bestMove = -1;
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        const result = checkWinner(board);
        if (result !== null) {
            return result;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
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