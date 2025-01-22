import React from 'react';

function Piece({ type }) {
  const pieces = {
    'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙', // black pieces
    'K': '♚', 'Q': '♛', 'R': '♜', 'B': '♝', 'N': '♞', 'P': '♟', // white pieces
  };

  const pieceStyle = {
    fontSize: '55px',
    color: type === type.toUpperCase() ? '#000' : '#fff',
    textShadow: type === type.toUpperCase() 
      ? '2px 2px 2px rgba(0,0,0,0.2)' 
      : '2px 2px 2px rgba(0,0,0,0.4)',
    transform: 'translateY(-2px)',
  };

  return (
    <div className="piece" style={pieceStyle}>
      {pieces[type]}
    </div>
  );
}

export default Piece;
