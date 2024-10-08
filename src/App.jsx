import { useState } from "react";
import confetti from "canvas-confetti";

import { Square } from "./components/Square";
import { TURNS, WINNER_COMBOS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";

function App() {
  //estado para tablero se act
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");

    return boardFromStorage //decidimos valor inicial del estado
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });
  //nuevo estato para conocer el turno
  const [turn, setTurn] = useState(() => {
    const turnFormStorage = window.localStorage.getItem("turn");

    return turnFormStorage ?? TURNS.X;
  });
  //null = no hay ganador, false = empate, true = ganador
  const [winner, setWinner] = useState(null);

  const checkWinner = (boarToCheck) => {
    //revisar todas la combinaciones ganadoras
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boarToCheck[a] && // 0 => X u O
        boarToCheck[a] === boarToCheck[b] &&
        boarToCheck[a] === boarToCheck[c]
      ) {
        // REGRESAMOS AL GANADOR
        return boarToCheck[a]; // X u O
      }
    }
    //si no hay ganador
    return null;
  };

  const resetGame = () => {
    //resetear todo a sus valores iniciales

    //tablero
    setBoard(Array(9).fill(null));
    //turno
    setTurn(TURNS.X);
    //ganador
    setWinner(null);
    //reseteamos el localStorage
    window.localStorage.removeItem("turn");
    window.localStorage.removeItem("board");
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((Square) => Square !== null); // revisamos que todo tenga X u O
  };
  const updateBoard = (idx) => {
    // nunca mutar las props
    //no act la posicion si ya existe algo
    if (board[idx] || winner) return;

    //act tablero
    const newBoard = [...board];
    newBoard[idx] = turn; // X u O
    setBoard(newBoard);
    //act turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //GUARDAR PARTIDA
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);
    //revisamos si hay ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner); //act el estado del ganador (ASINCRONO)
      // alert(`El ganador es ${newWinner}`);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };
  return (
    <main className="board">
      <h1>Juego del Gato</h1>
      <button onClick={resetGame}>Reinicia el Juego</button>
      <section className="game">
        {board.map((cell, idx) => {
          return (
            <Square key={idx} idx={idx} updateBoard={updateBoard}>
              {board[idx]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
