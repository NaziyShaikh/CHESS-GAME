import React from 'react';
import './MoveList.css';

const MoveList = ({ moves }) => {
  // Ensure moves is an array and all elements are strings
  const validMoves = Array.isArray(moves) ? moves.filter(move => typeof move === 'string') : [];

  return (
    <div className="move-list">
      <h3>Move History</h3>
      <div className="moves">
        {validMoves.map((move, index) => (
          <div key={index} className="move-entry">
            <span className="move-number">
              {Math.floor(index / 2) + 1}
              {index % 2 === 0 ? '.' : '...'}
            </span>
            <span className="move-notation">{move}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveList;
