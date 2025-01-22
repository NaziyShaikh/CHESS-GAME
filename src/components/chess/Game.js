import React, { useState, useRef } from 'react';
import ChessBoard from './ChessBoard';
import Timer from './Timer';
import MoveList from './MoveList';
import './Game.css';

function Game() {
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [moves, setMoves] = useState([]);
  const [gameState, setGameState] = useState({
    isCheck: false,
    isCheckmate: false,
    isGameOver: false,
    moveCount: 0
  });
  
  const whiteTimerRef = useRef();
  const blackTimerRef = useRef();

  const handleMove = (moveData) => {
    const notation = generateMoveNotation(moveData);
    setMoves(prevMoves => [...prevMoves, notation]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    
    setGameState(prev => ({
      ...prev,
      moveCount: prev.moveCount + 1
    }));
  };

  const resetGame = () => {
    setCurrentPlayer('white');
    setMoves([]);
    setGameState({
      isCheck: false,
      isCheckmate: false,
      isGameOver: false,
      moveCount: 0
    });

    if (whiteTimerRef.current) whiteTimerRef.current.resetTimer();
    if (blackTimerRef.current) blackTimerRef.current.resetTimer();
  };

  const generateMoveNotation = (moveData) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    const fromFile = files[moveData.from.col];
    const fromRank = ranks[moveData.from.row];
    const toFile = files[moveData.to.col];
    const toRank = ranks[moveData.to.row];
    
    const pieceSymbol = getPieceSymbol(moveData.piece);
    
    return `${pieceSymbol}${fromFile}${fromRank}-${toFile}${toRank}`;
  };

  const getPieceSymbol = (piece) => {
    const symbols = {
      king: 'K',
      queen: 'Q',
      rook: 'R',
      bishop: 'B',
      knight: 'N',
      pawn: ''
    };
    return symbols[piece.type] || '';
  };

  return (
    <div className="game">
      <div className="game-board">
        <ChessBoard
          onMove={handleMove}
          currentPlayer={currentPlayer}
          gameState={gameState}
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
      </div>
      
      {gameState.isCheck && <div className="alert">Check!</div>}
      {gameState.isCheckmate && <div className="alert">Checkmate!</div>}
      {gameState.isGameOver && <div className="alert">Game Over</div>}
    </div>
  );
}

export default Game;
