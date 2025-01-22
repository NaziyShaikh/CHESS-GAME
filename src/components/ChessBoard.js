import React, { useState, useEffect } from 'react';
import './Board.css'; // Create a CSS file for styling
import Timer from './Timer'; // Import the Timer component
import Piece from './Piece'; // Import the Piece component

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
  const [selectedPiece, setSelectedPiece] = useState(null); // Track selected piece

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
    console.log('Selected Piece:', selectedPiece);
    console.log('Current Board State:', board);
    
    if (selectedPiece) {
      const legalMoves = getLegalMoves(board, selectedPiece.row, selectedPiece.col, selectedPiece.piece);
      if (legalMoves.some(move => move.row === row && move.col === col)) {
        const newBoard = [...board];
        newBoard[row][col] = selectedPiece.piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        console.log('New Board State:', newBoard);
        setMoveList([...moveList, `${selectedPiece.piece} to ${row}-${col}`]);
        setTurn(turn === 'white' ? 'black' : 'white');
        setActiveTimer(turn === 'white' ? 'black' : 'white');
        setSelectedPiece(null);
      } else {
        alert('Illegal move!');
      }
    } else {
      const piece = board[row][col];
      if (piece && (turn === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
        setSelectedPiece({ piece, row, col });
      }
    }
  };

  const renderSquare = (row, col) => {
    return (
      <div
        className={`square ${((row + col) % 2 === 0) ? 'light' : 'dark'}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {board[row][col] && <Piece type={board[row][col]} />}
      </div>
    );
  };

  return (
    <div>
      <Timer player={turn} onTimeUp={() => alert(`${turn} time is up!`)} />
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
