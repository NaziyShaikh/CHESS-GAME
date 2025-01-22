import React from 'react';
import './Preview.css';

const Preview = () => {
  // Sample game state for preview
  const previewMoves = [
    'e2-e4',
    'e7-e5',
    'Ng1-f3',
    'Nb8-c6',
    'Bf1-c4',
    'Bf8-c5'
  ];

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Chess Game Preview</h2>
      </div>
      <div className="preview-board">
        <div className="preview-row header-row">
          <div className="corner"></div>
          {'abcdefgh'.split('').map(file => (
            <div key={file} className="file-label">{file}</div>
          ))}
          <div className="corner"></div>
        </div>
        {[...Array(8)].map((_, row) => (
          <div key={row} className="preview-row">
            <div className="rank-label">{8 - row}</div>
            {[...Array(8)].map((_, col) => {
              const isLight = (row + col) % 2 === 0;
              const piece = getInitialPiece(row, col);
              return (
                <div 
                  key={col} 
                  className={`preview-square ${isLight ? 'light' : 'dark'}`}
                >
                  {piece && (
                    <span className={`piece ${piece.color}`}>
                      {getPieceSymbol(piece)}
                    </span>
                  )}
                </div>
              );
            })}
            <div className="rank-label">{8 - row}</div>
          </div>
        ))}
        <div className="preview-row header-row">
          <div className="corner"></div>
          {'abcdefgh'.split('').map(file => (
            <div key={file} className="file-label">{file}</div>
          ))}
          <div className="corner"></div>
        </div>
      </div>
      <div className="preview-moves">
        <h3>Sample Moves</h3>
        <div className="moves-list">
          {previewMoves.map((move, index) => (
            <div key={index} className="move-entry">
              <span className="move-number">
                {Math.floor(index / 2) + 1}
                {index % 2 === 0 ? '.' : '...'}
              </span>
              <span className="move-text">{move}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getInitialPiece(row, col) {
  const pieces = {
    0: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    1: Array(8).fill('pawn'),
    6: Array(8).fill('pawn'),
    7: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  };

  if (row in pieces) {
    return {
      type: pieces[row][col],
      color: row < 2 ? 'black' : 'white'
    };
  }
  return null;
}

function getPieceSymbol(piece) {
  const symbols = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  };
  return symbols[piece.color][piece.type];
}

export default Preview;
