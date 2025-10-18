// src/app/page.tsx
"use client";
import { useState } from "react";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
}

interface BoardProps {
  isNext: boolean;
  squares: (string | null)[];
  onPlay: (squares: (string | null)[]) => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ isNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = isNext ? "X" : "O";
    onPlay(nextSquares as (string | null)[]);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (isNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0] ?? ""} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1] ?? ""} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2] ?? ""} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3] ?? ""} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4] ?? ""} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5] ?? ""} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6] ?? ""} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7] ?? ""} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8] ?? ""} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [xIsNext, setXIsNext] = useState(true);
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
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#2d3748', 
        marginBottom: '1rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Tic Tac Toe
      </h1>
      <div className="game-board">
        <Board isNext={xisNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: '600', 
          color: '#4a5568', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Game History
        </h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as string;
    }
  }
  return null;
}

export default function Page() {
  return <Game />;
}
