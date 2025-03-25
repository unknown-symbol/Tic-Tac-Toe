const Elements = (() => {
  const boardContainer = document.querySelector(".board-container");

  const getSquares = () => {
    return boardContainer.querySelectorAll(".square");
  };

  const newSquare = (mark) => {
    const square = document.createElement("div");
    square.className = "square";
    square.textContent = mark;
    return square;
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

  return { createBoard, getSquares, clearBoard };
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

  let currentPlayer;
  const playTurn = (player1, player2) => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    winner = checkWinner(Gameboard.getBoard());

    if (!winner) {
      Elements.getSquares().forEach((element, index) => {
        if (element.textContent == "") {
          element.classList += ` ${currentPlayer.mark}-mark`;
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
    } else {
      console.log(`Game ended! ${winner.name} wins`);
      console.log(`${winner.winCondition}`);
    }
  };

  const startGame = () => {
    const player1 = player("Me", "X");
    const player2 = player("Not me", "O");

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

      if (winner) return { ...winner, winCondition };
    }
  };

  return {
    startGame,
  };
})();

Controller.startGame();
