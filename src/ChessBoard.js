import React, { useState, useEffect } from 'react';
import './ChessBoard.css'; // Create a CSS file for styling

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState('white'); // 'white' or 'black'
  const [moveList, setMoveList] = useState([]);
  const [timers, setTimers] = useState({ white: 300, black: 300 }); // 5 minutes for each player
  const [activeTimer, setActiveTimer] = useState('white');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimers((prev) => ({
        ...prev,
        [activeTimer]: prev[activeTimer] - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTimer]);

  const handleSquareClick = (row, col) => {
    // Logic to select a piece and move it
    if (selectedPiece) {
      const legalMoves = getLegalMoves(selectedPiece, row, col);
      if (legalMoves.includes(`${row}-${col}`)) {
        const newBoard = [...board];
        newBoard[row][col] = selectedPiece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        // Store the move as a string
        setMoveList([...moveList, `${selectedPiece} to ${row}-${col}`]);
        setTurn(turn === 'white' ? 'black' : 'white');
        setActiveTimer(turn === 'white' ? 'black' : 'white');
        setSelectedPiece(null);
      } else {
        alert('Illegal move!');
      }
    } else {
      const piece = board[row][col];
      if (piece && (turn === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        setSelectedPiece(piece);
      }
    }
  };

  const renderSquare = (row, col) => {
    return (
      <div
        className={`square ${((row + col) % 2 === 0) ? 'light' : 'dark'}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {board[row][col] && <span>{board[row][col]}</span>}
      </div>
    );
  };

  return (
    <div>
      <div className="timer">
        <div>White: {Math.floor(timers.white / 60)}:{timers.white % 60}</div>
        <div>Black: {Math.floor(timers.black / 60)}:{timers.black % 60}</div>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <div className="move-list">
        <h3>Move List</h3>
        <ul>
          {moveList.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChessBoard;
