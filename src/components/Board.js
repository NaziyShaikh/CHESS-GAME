import React from 'react';
import Square from './Square';
import './Board.css';

function Board({ board, selectedPiece, onSquareClick }) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="board-wrapper">
      {/* Rank coordinates (numbers) */}
      {ranks.map((rank, index) => (
        <div
          key={rank}
          className="coordinates rank-coordinate"
          style={{ top: `${(index * 12.5) + 10}%` }}
        >
          {rank}
        </div>
      ))}

      {/* File coordinates (letters) */}
      {files.map((file, index) => (
        <div
          key={file}
          className="coordinates file-coordinate"
          style={{ left: `${(index * 12.5) + 10}%` }}
        >
          {file}
        </div>
      ))}

      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                isDark={(rowIndex + colIndex) % 2 === 1}
                onClick={() => onSquareClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;