const Elements = (() => {
  const boardContainer = document.querySelector(".board-container");
  const winnerMessage = document.querySelector(".winner-message");
  const gameStats = document.querySelector(".game-stats");
  const resetButton = document.querySelector(".reset-button");

  resetButton.addEventListener("click", () => {
    window.location.reload();
  });

  const getSquares = () => {
    return boardContainer.querySelectorAll(".square");
  };

  const newSquare = (mark) => {
    const square = document.createElement("div");

    square.className = "square";
    square.textContent = mark;

    return square;
  };
  const setPlayers = (players, current, winner) => {
    gameStats.querySelectorAll(".player-card").forEach((player, index) => {
      player.classList.toggle("current", players[index] === current);
      player.classList.toggle("winner", players[index] === winner);

      player.querySelector(".player-name").value = players[index].name;
      player
        .querySelector(".player-score")
        .querySelector(".player-score-number").textContent =
        players[index].getScore();
    });
  };
  const setWinner = (winner) => {
    if (!winner) {
      gameStats.querySelectorAll(".player-card").forEach((player) => {
        player.classList.remove("current");
        player.classList.remove("winner");
      });

      winnerMessage.style.display = "none";
      return;
    }

    if (winner == "Draw") {
      winnerMessage.querySelector(".winner-name").textContent = " ";
      winnerMessage.querySelector(".winner-suffix").textContent = "Draw!";
    } else {
      winnerMessage.querySelector(".winner-name").textContent = winner.name;
      winnerMessage.querySelector(".winner-suffix").textContent = " wins!";
    }

    winnerMessage.style.display = "inline";

    const roundButton = document.querySelector(".round-button");

    roundButton.disabled = false;

    roundButton.addEventListener(
      "click",
      () => {
        roundButton.disabled = true;

        roundNumber = document.querySelector(".round-number");

        roundNumber.textContent = +roundNumber.textContent + 1;

        Controller.resetGame();
      },
      { once: true }
    );
  };

  const clearBoard = () => {
    getSquares().forEach((square) => {
      square.remove();
    });
  };

  const createBoard = (board) => {
    clearBoard();

    board.forEach((square) => {
      boardContainer.appendChild(newSquare(square.mark));
    });
  };

  return { createBoard, getSquares, clearBoard, setWinner, setPlayers };
})();

const Gameboard = (() => {
  const board = [];

  const square = { mark: "" };

  const getBoard = () => {
    return board;
  };

  const setMark = (mark, index) => {
    board[index] = { mark };
    Elements.createBoard(getBoard());
  };

  const create = () => {
    board.length = 0;

    for (let index = 0; index < 9; index++) {
      board.push(square);
    }
    Elements.createBoard(board);
  };

  return { getBoard, setMark, create };
})();

const Controller = (() => {
  const players = [];

  function player(name, mark) {
    this.name = name;
    this.mark = mark;
    let score = 0;

    const getScore = () => score;
    const giveScore = () => score++;

    const newPlayer = { name, mark, getScore, giveScore };

    players.push(newPlayer);
    return newPlayer;
  }

  const player1 = player("Player One", "X");
  const player2 = player("Player Two", "O");

  const nameInputs = document.querySelectorAll(".player-name");

  nameInputs.forEach((nameInput, index) => {
    nameInput.addEventListener("change", () => {
      if (nameInput.value == "") nameInput.value = "name";

      players[index].name = nameInput.value;
    });
  });

  document.querySelector(".round-number").textContent = 1;

  let currentPlayer;
  const playTurn = (player1, player2) => {
    const winner = checkWinner(Gameboard.getBoard());

    if (!winner) {
      currentPlayer = currentPlayer === player1 ? player2 : player1;

      Elements.getSquares().forEach((element, index) => {
        if (element.textContent == "") {
          element.classList.add(`${currentPlayer.mark}-mark`);
          element.addEventListener(
            "click",
            () => {
              Gameboard.setMark(currentPlayer.mark, index);
              playTurn(player1, player2);
            },
            { once: true }
          );
        }
      });
    } else if (winner == "Draw") {
      Elements.setWinner(winner);
    } else {
      winner.giveScore();

      Elements.setWinner(winner);

      Elements.getSquares().forEach((element, index) => {
        if (winner.winCondition.includes(index)) {
          element.classList.add("win-position");
        }
      });
    }

    Elements.setPlayers(players, currentPlayer, winner);
  };

  const startGame = () => {
    Gameboard.create();
    playTurn(player1, player2);
  };

  const resetGame = () => {
    Elements.setWinner();

    Gameboard.create();

    playTurn(player1, player2);
  };

  const checkWinner = (board) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const winCondition of winConditions) {
      const values = [];

      winCondition.forEach((position) => {
        values.push(board[position].mark);
      });

      const winner = players.find((player) => {
        return values.every((value) => value == player.mark);
      });

      if (winner) {
        winner.winCondition = winCondition;
        return winner;
      }
    }

    if (board.every((value) => value.mark !== "")) {
      return "Draw";
    }
  };

  return {
    startGame,
    resetGame,
  };
})();

Controller.startGame();
