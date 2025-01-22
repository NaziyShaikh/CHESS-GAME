import React from 'react';

function MoveList({ moves }) {
  return (
    <div className="move-list">
      <h3>Move History</h3>
      <div className="moves">
        {moves.map((move, index) => (
          <div key={index} className="move">
            {index + 1}. {move}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveList;