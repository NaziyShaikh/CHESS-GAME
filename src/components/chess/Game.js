import React, { useState, useRef, useCallback } from 'react';
import ChessBoard from './ChessBoard';
import Timer from './Timer';
import MoveList from './MoveList';
import CapturedPieces from './CapturedPieces';
import './Game.css';

function Game() {
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [moves, setMoves] = useState([]);
  const [board, setBoard] = useState(() => {
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
  });
  const [boardHistory, setBoardHistory] = useState([]);
  const [gameState, setGameState] = useState({
    isCheck: false,
    isCheckmate: false,
    isGameOver: false,
    moveCount: 0,
    winner: null
  });
  const [capturedPieces, setCapturedPieces] = useState({
    white: [],
    black: []
  });
  
  const whiteTimerRef = useRef();
  const blackTimerRef = useRef();

  const isValidMove = useCallback((from, toRow, toCol, currentBoard) => {
    const piece = from.piece;
    const targetSquare = currentBoard[toRow][toCol];
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
            !currentBoard[from.row + direction][from.col] && 
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
        return from.row === toRow || from.col === toCol;

      case 'knight':
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

      case 'bishop':
        return absRowDiff === absColDiff;

      case 'queen':
        return from.row === toRow || 
               from.col === toCol || 
               absRowDiff === absColDiff;

      case 'king':
        return absRowDiff <= 1 && absColDiff <= 1;

      default:
        return false;
    }
  }, []);

  const findKing = useCallback((currentBoard, color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  }, []);

  const isSquareUnderAttack = useCallback((currentBoard, row, col, attackerColor) => {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const attacker = currentBoard[fromRow][fromCol];
        if (attacker && attacker.color === attackerColor) {
          try {
            if (isValidMove({ 
              row: fromRow, 
              col: fromCol, 
              piece: attacker 
            }, row, col, currentBoard)) {
              return true;
            }
          } catch (error) {
            console.error('Error checking attack:', error);
          }
        }
      }
    }
    return false;
  }, [isValidMove]);

  const checkForCheck = useCallback((currentBoard, color) => {
    const king = findKing(currentBoard, color);
    if (!king) return false;

    const opponentColor = color === 'white' ? 'black' : 'white';
    return isSquareUnderAttack (currentBoard, king.row, king.col, opponentColor);
  }, [findKing, isSquareUnderAttack]);

  const findCheckResolvingMoves = useCallback((currentBoard, color) => {
    const resolvingMoves = [];
    const king = findKing(currentBoard, color);
    if (!king) return resolvingMoves;

    const opponentColor = color === 'white' ? 'black' : 'white';

    // Find all pieces checking the king
    const checkingPieces = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const attacker = currentBoard[fromRow][fromCol];
        if (attacker && attacker.color === opponentColor) {
          if (isValidMove({ 
            row: fromRow, 
            col: fromCol, 
            piece: attacker 
          }, king.row, king.col, currentBoard)) {
            checkingPieces.push({ 
              row: fromRow, 
              col: fromCol, 
              piece: attacker 
            });
          }
        }
      }
    }

    // If no checking pieces, no resolving moves needed
    if (checkingPieces.length === 0) return resolvingMoves;

    // Try to block or capture checking pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece && piece.color === color) {
          for (let checkingPiece of checkingPieces) {
            // Try moving the piece to block or capture the checking piece
            if (isValidMove({ row, col, piece }, checkingPiece.row, checkingPiece.col, currentBoard)) {
              // Create a copy of the board to simulate the move
              const newBoard = currentBoard.map(row => [...row]);
              newBoard[checkingPiece.row][checkingPiece.col] = newBoard[row][col];
              newBoard[row][col] = null;

              // Check if this move resolves the check
              if (!checkForCheck(newBoard, color)) {
                resolvingMoves.push({ 
                  from: { row, col }, 
                  to: { row: checkingPiece.row, col: checkingPiece.col } 
                });
              }
            }
          }
        }
      }
    }

    return resolvingMoves;
  }, [findKing, isValidMove, checkForCheck]);

  const checkForCheckmate = useCallback((currentBoard, color) => {
    const king = findKing(currentBoard, color);
    if (!king) return false;

    // First, check if the king is in check
    const opponentColor = color === 'white' ? 'black' : 'white';
    const isInCheck = checkForCheck(currentBoard, color);
    
    // If not in check, it's not a checkmate
    if (!isInCheck) return false;

    // Check if the king can move to any safe square
    const possibleKingMoves = [
      { row: king.row - 1, col: king.col },
      { row: king.row + 1, col: king.col },
      { row: king.row, col: king.col - 1 },
      { row: king.row, col: king.col + 1 },
      { row: king.row - 1, col: king.col - 1 },
      { row: king.row - 1, col: king.col + 1 },
      { row: king.row + 1, col: king.col - 1 },
      { row: king.row + 1, col: king.col + 1 }
    ];

    // Check if king can move to any safe square
    for (let move of possibleKingMoves) {
      if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
        const targetPiece = currentBoard[move.row][move.col];
        if ((!targetPiece || targetPiece.color !== color) && 
            !checkForCheck({
              ...currentBoard,
              [king.row]: { ...currentBoard[king.row], [king.col]: null },
              [move.row]: { 
                ...currentBoard[move.row], 
                [move.col]: { type: 'king', color: color }
              }
            }, color)) {
          return false;
        }
      }
    }

    // Check if any piece can block or capture the checking pieces
    const checkResolvingMoves = findCheckResolvingMoves(currentBoard, color);
    
    // If there are no moves to resolve the check, it's a checkmate
    return checkResolvingMoves.length === 0;
  }, [findKing, checkForCheck, findCheckResolvingMoves]);

  const generateMoveNotation = useCallback((moveData) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const { from, to, piece } = moveData;

    // Determine piece type (use first letter, capitalize)
    const pieceNotation = piece.type === 'pawn' ? '' : piece.type[0].toUpperCase();

    // Convert row and col to chess notation
    const fromNotation = `${files[from.col]}${ranks[from.row]}`;
    const toNotation = `${files[to.col]}${ranks[to.row]}`;

    // Capture notation
    const captureSymbol = board[to.row][to.col] ? 'x' : '';

    return `${pieceNotation}${fromNotation}${captureSymbol}${toNotation}`;
  }, [board]);

  const updateCapturedPieces = useCallback((capturedPiece) => {
    if (capturedPiece) {
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
      }));
    }
  }, []);

  const handleMove = useCallback((moveData) => {
    const { from, to } = moveData;
    const newBoard = board.map(row => [...row]);
    
    // Check if a piece is being captured
    const capturedPiece = newBoard[to.row][to.col];
    if (capturedPiece) {
      updateCapturedPieces(capturedPiece);
    }

    // Move the piece
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;

    const piece = newBoard[to.row][to.col];

    // Attach piece information to moveData
    moveData.piece = piece;

    // Save current board state to history before making the move
    setBoardHistory(prev => [...prev, JSON.parse(JSON.stringify(board))]);

    // Update board and other game state
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setMoves(prevMoves => [...prevMoves, {
      notation: generateMoveNotation(moveData),
      details: moveData
    }]);

    // Check for check and checkmate
    const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
    const isInCheck = checkForCheck(newBoard, opponentColor);
    const isInCheckmate = isInCheck && checkForCheckmate(newBoard, opponentColor);

    setGameState(prevState => ({
      ...prevState,
      isCheck: isInCheck,
      isCheckmate: isInCheckmate,
      isGameOver: isInCheckmate,
      winner: isInCheckmate ? currentPlayer : null
    }));

    // Stop timers if game is over
    if (isInCheckmate) {
      // Safely check and stop timers
      if (whiteTimerRef.current && typeof whiteTimerRef.current.stopTimer === 'function') {
        whiteTimerRef.current.stopTimer();
      }
      if (blackTimerRef.current && typeof blackTimerRef.current.stopTimer === 'function') {
        blackTimerRef.current.stopTimer();
      }
    }
  }, [board, currentPlayer, checkForCheck, checkForCheckmate, generateMoveNotation, updateCapturedPieces]);

  const undoLastMove = () => {
    if (boardHistory.length > 0) {
      // Revert to the previous board state
      const previousBoard = boardHistory[boardHistory.length - 1];
      setBoard(previousBoard);

      // Remove the last board state from history
      setBoardHistory(prev => prev.slice(0, -1));

      // Revert to the previous player
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

      // Remove the last move from moves list
      setMoves(prev => prev.slice(0, -1));

      // Reset game state
      setGameState(prevState => ({
        ...prevState,
        isCheck: false,
        isCheckmate: false,
        isGameOver: false,
        winner: null
      }));
    }
  };

  const resetGame = () => {
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

    setBoard(initialBoard);
    setCurrentPlayer('white');
    setMoves([]);
    setBoardHistory([]);
    setGameState({
      isCheck: false,
      isCheckmate: false,
      isGameOver: false,
      moveCount: 0,
      winner: null
    });
    setCapturedPieces({
      white: [],
      black: []
    });

    if (whiteTimerRef.current) whiteTimerRef.current.resetTimer();
    if (blackTimerRef.current) blackTimerRef.current.resetTimer();
  };

  const continueGame = () => {
    resetGame();
  };

  return (
    <div className="game">
      <div className="game-board">
        <ChessBoard
          onMove={handleMove}
          currentPlayer={currentPlayer}
          gameState={gameState}
          board={board}
        />
      </div>
      <div className="game-info">
        <div className="player-info black-player">
          <h2>Black</h2>
          <Timer
            ref={blackTimerRef}
            isActive={currentPlayer === 'black'}
            initialTime={600}
          />
        </div>
        
        <div className="current-turn">
          Current Turn: {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
        </div>

        <div className="move-list">
          <h3>Move History</h3>
          <MoveList moves={moves} />
        </div>

        <div className="player-info white-player">
          <h2>White</h2>
          <Timer
            ref={whiteTimerRef}
            isActive={currentPlayer === 'white'}
            initialTime={600}
          />
        </div>

        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>

        <button className="undo-button" onClick={undoLastMove}>
          Undo Last Move
        </button>

        {gameState.isCheck && (
          <div className="alert check-alert">
            Check!
          </div>
        )}

        {gameState.isCheckmate && (
          <div className="alert checkmate-alert">
            Checkmate! {gameState.winner} wins!
            <button onClick={continueGame}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
