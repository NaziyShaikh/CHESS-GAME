import React from 'react';
import Piece from './Piece';
import './Square.css';

function Square({ piece, isSelected, isDark, isLegalMove, onClick }) {
  return (
    <div 
      className={`
        square 
        ${isDark ? 'dark' : 'light'} 
        ${isSelected ? 'selected' : ''} 
        ${isLegalMove ? 'legal-move' : ''}
      `}
      onClick={onClick}
    >
      {piece && <Piece type={piece} />}
      {isLegalMove && !piece && <div className="legal-move-indicator" />}
      {isLegalMove && piece && <div className="capture-indicator" />}
    </div>
  );
}

export default Square;