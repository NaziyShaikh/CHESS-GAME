import React from 'react';
import './MoveList.css';

function MoveList({ moves }) {
  return (
    <div className="move-list">
      <h3>Move History</h3>
      <div className="moves-container">
        {moves.map((move, index) => (
          <div key={index} className="move-entry">
            <span className="move-number">{index + 1}.</span>
            <span className="move-notation">{move.notation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveList;
