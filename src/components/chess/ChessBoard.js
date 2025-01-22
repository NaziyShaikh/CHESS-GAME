import React, { useState, useEffect } from 'react';
import './ChessBoard.css';

const ChessBoard = ({ onMove, currentPlayer, gameState }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [board, setBoard] = useState(() => initializeBoard());

  function initializeBoard() {
    const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
    
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      initialBoard[1][i] = { type: 'pawn', color: 'black' };
      initialBoard[6][i] = { type: 'pawn', color: 'white' };
    }

    // Set up other pieces
    const backRowPieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      initialBoard[0][i] = { type: backRowPieces[i], color: 'black' };
      initialBoard[7][i] = { type: backRowPieces[i], color: 'white' };
    }

    return initialBoard;
  }

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    // If no piece is selected and clicked on a piece of current player's color
    if (!selectedPiece && piece && piece.color === currentPlayer) {
      setSelectedPiece({ row, col, piece });
    } 
    // If a piece is already selected
    else if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        return;
      }

      // If clicking on another piece of the same color, select that piece instead
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col, piece });
        return;
      }

      // Check if the move is valid
      if (isValidMove(selectedPiece, row, col, board)) {
        // Create a deep copy of the board
        const newBoard = JSON.parse(JSON.stringify(board));
        
        // Move the piece
        newBoard[row][col] = { ...selectedPiece.piece };
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        // Update the board state
        setBoard(newBoard);
        
        // Notify parent component of the move
        onMove({
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row, col },
          piece: selectedPiece.piece
        });
      }
      setSelectedPiece(null);
    }
  };

  const isValidMove = (from, toRow, toCol, board) => {
    // Can't move to a square with our own piece
    const targetSquare = board[toRow][toCol];
    if (targetSquare && targetSquare.color === currentPlayer) {
      return false;
    }

    // Basic pawn movement
    if (from.piece.type === 'pawn') {
      const direction = from.piece.color === 'white' ? -1 : 1;
      const startRow = from.piece.color === 'white' ? 6 : 1;

      // Moving forward one square
      if (from.col === toCol && toRow === from.row + direction && !targetSquare) {
        return true;
      }

      // Moving forward two squares from starting position
      if (from.col === toCol && from.row === startRow && 
          toRow === from.row + 2 * direction && 
          !board[from.row + direction][from.col] && 
          !targetSquare) {
        return true;
      }

      // Capturing diagonally
      if (Math.abs(from.col - toCol) === 1 && 
          toRow === from.row + direction && 
          targetSquare && 
          targetSquare.color !== from.piece.color) {
        return true;
      }

      return false;
    }

    // For now, allow other pieces to move freely
    return true;
  };

  const getPieceSymbol = (piece) => {
    if (!piece) return null;
    
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    return symbols[piece.color][piece.type];
  };

  // Reset board when game is reset
  useEffect(() => {
    if (gameState.moveCount === 0) {
      setBoard(initializeBoard());
      setSelectedPiece(null);
    }
  }, [gameState.moveCount]);

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const squareColor = (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark';
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${squareColor} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <div className={`piece ${piece.color}`}>
                    {getPieceSymbol(piece)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
