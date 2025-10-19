// src/app/page.tsx
"use client";
import { useState } from "react";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
  isHighlighted?: boolean;
}

interface BoardProps {
  isNext: boolean;
  squares: (string | null)[];
  onPlay: (squares: (string | null)[]) => void;
}

function Square({ value, onSquareClick, isHighlighted = false }: SquareProps) {
  return (
    <button
      className={`square ${
        isHighlighted ? "bg-yellow-400 border-red-500" : ""
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ isNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares).winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = isNext ? "X" : "O";
    onPlay(nextSquares as (string | null)[]);

    const result = calculateWinner(nextSquares);
    if (result.winner) {
      alert(`🎉 ${result.winner} wins!`);
    } else if (nextSquares.every((square) => square !== null)) {
      alert("🤝 It's a draw!");
    }
  }

  const { winner, winningSquares } = calculateWinner(squares);
  const isDraw = !winner && squares.every((square) => square !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw"
    : `Next player: ${isNext ? "X" : "O"}`;

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }, (_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: 3 }, (_, col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index] ?? ""}
                onSquareClick={() => handleClick(index)}
                isHighlighted={winningSquares?.includes(index) || false}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xisNext = currentMove % 2 === 0;
  

 
  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <span
            style={{
              fontWeight: "bold",
              color: "#667eea",
              padding: "0.75rem 1rem",
              display: "block",
              textAlign: "center",
            }}
          >
            You are at move #{move}
          </span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });
  return (
    <div className="game">
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#2d3748",
          marginBottom: "1rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Tic Tac Toe
      </h1>
      <div className="game-board">
        <Board isNext={xisNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#4a5568",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Game History
        </h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]): {
  winner: string | null;
  winningSquares: number[] | null;
} {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as string, winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: null };
}

export default function Page() {
  return <Game />;
}
