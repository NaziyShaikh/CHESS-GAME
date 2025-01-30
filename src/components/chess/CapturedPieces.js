import React from 'react';
import './CapturedPieces.css';

const pieceSymbols = {
  white: {
    king: '♔', queen: '♕', rook: '♖', 
    bishop: '♗', knight: '♘', pawn: '♙'
  },
  black: {
    king: '♚', queen: '♛', rook: '♜', 
    bishop: '♝', knight: '♞', pawn: '♟'
  }
};

const CapturedPieces = ({ capturedPieces }) => {
  return (
    <div className="captured-pieces-container">
      <div className="captured-white">
        <h3>Black Pieces Captured</h3>
        {capturedPieces.black.map((piece, index) => (
          <span key={index} className="captured-piece">
            {pieceSymbols.white[piece.type]}
          </span>
        ))}
      </div>
      <div className="captured-black">
        <h3>White Pieces Captured</h3>
        {capturedPieces.white.map((piece, index) => (
          <span key={index} className="captured-piece">
            {pieceSymbols.black[piece.type]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;