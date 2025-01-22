import React from 'react';
import Piece from './Piece';
import './CapturedPieces.css';

function CapturedPieces({ pieces, player }) {
  return (
    <div className="captured-pieces">
      <div className="captured-pieces-label">{player}'s captures:</div>
      <div className="captured-pieces-list">
        {pieces.map((piece, index) => (
          <div key={index} className="captured-piece">
            <Piece type={piece} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CapturedPieces;