import React, { useState, useEffect } from 'react';
import './ChessBoard.css';

const ChessBoard = ({ onMove, currentPlayer, gameState, board }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  // Reset possible moves when the board changes
  useEffect(() => {
    setPossibleMoves([]);
    setSelectedPiece(null);
  }, [board]);

  const findPossibleMoves = (fromRow, fromCol) => {
    const moves = [];
    const piece = board[fromRow][fromCol];

    if (!piece || piece.color !== currentPlayer) {
      console.log('Invalid piece selection:', { piece, currentPlayer });
      return moves;
    }

    // Check all board squares for valid moves
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        // Skip the original square
        if (toRow === fromRow && toCol === fromCol) continue;

        const moveData = {
          from: { 
            row: fromRow, 
            col: fromCol, 
            piece 
          },
          row: toRow,
          col: toCol
        };

        // Validate the move based on piece type and board state
        if (isValidMove(moveData.from, toRow, toCol, board)) {
          moves.push({ row: toRow, col: toCol });
        }
      }
    }

    console.log('Possible moves:', moves);
    return moves;
  };

  const isValidMove = (from, toRow, toCol, board) => {
    const piece = from.piece;
    const targetSquare = board[toRow][toCol];
    const rowDiff = toRow - from.row;
    const colDiff = toCol - from.col;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    // Can't move to a square with our own piece
    if (targetSquare && targetSquare.color === piece.color) {
      return false;
    }

    // Piece-specific movement validation
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;

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
            targetSquare.color !== piece.color) {
          return true;
        }

        return false;

      case 'rook':
        // Move only horizontally or vertically
        return from.row === toRow || from.col === toCol;

      case 'knight':
        // L-shaped moves: 2 squares in one direction, 1 square in perpendicular direction
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

      case 'bishop':
        // Move diagonally
        return absRowDiff === absColDiff;

      case 'queen':
        // Combines rook and bishop movements
        return from.row === toRow || 
               from.col === toCol || 
               absRowDiff === absColDiff;

      case 'king':
        // Move one square in any direction
        return absRowDiff <= 1 && absColDiff <= 1;

      default:
        return false;
    }
  };

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    // If no piece is selected and clicked on a piece of current player's color
    if (!selectedPiece && piece && piece.color === currentPlayer) {
      console.log('Selecting piece:', piece);
      setSelectedPiece({ row, col, piece });
      // Find and set possible moves for the selected piece
      const moves = findPossibleMoves(row, col);
      setPossibleMoves(moves);
    } 
    // If a piece is already selected
    else if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setPossibleMoves([]);
        return;
      }

      // If clicking on another piece of the same color, select that piece instead
      if (piece && piece.color === currentPlayer) {
        console.log('Selecting new piece:', piece);
        setSelectedPiece({ row, col, piece });
        // Find and set possible moves for the new selected piece
        const moves = findPossibleMoves(row, col);
        setPossibleMoves(moves);
        return;
      }

      // Check if the move is valid
      if (isValidMove(selectedPiece, row, col, board)) {
        console.log('Moving piece to:', row, col);
        // Notify parent component of the move
        onMove({
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row, col },
          piece: selectedPiece.piece
        });

        // Reset selection and possible moves
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    }
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

  return (
    <div className="chess-board">
      {gameState.isCheckmate && (
        <div className="checkmate-overlay">
          <div className="checkmate-message">
            Checkmate! {gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} wins!
          </div>
        </div>
      )}
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => {
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isPossibleMove = possibleMoves.some(
              move => move.row === rowIndex && move.col === colIndex
            );
            const squareColor = (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark';
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${squareColor} 
                  ${isSelected ? 'selected' : ''} 
                  ${isPossibleMove ? 'possible-move' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <div className={`piece ${piece.color}`}>
                    {getPieceSymbol(piece)}
                  </div>
                )}
                {isPossibleMove && (
                  <div 
                    className="move-dot"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      backgroundColor: piece ? 'red' : 'green',
                      borderRadius: '50%',
                      zIndex: 10
                    }}
                  />
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
