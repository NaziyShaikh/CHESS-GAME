// Check if a move is valid for a specific piece
export const isValidMove = (piece, fromRow, fromCol, toRow, toCol, board) => {
  const deltaRow = toRow - fromRow;
  const deltaCol = toCol - fromCol;

  switch (piece.type.toLowerCase()) {
    case 'pawn':
      return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, board);
    case 'rook':
      return isValidRookMove(fromRow, fromCol, toRow, toCol, board);
    case 'knight':
      return isValidKnightMove(deltaRow, deltaCol);
    case 'bishop':
      return isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
    case 'queen':
      return isValidQueenMove(fromRow, fromCol, toRow, toCol, board);
    case 'king':
      return isValidKingMove(deltaRow, deltaCol);
    default:
      return false;
  }
};

const isValidPawnMove = (piece, fromRow, fromCol, toRow, toCol, board) => {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Basic one square forward move
  if (deltaCol === 0 && deltaRow === direction && !board[toRow][toCol]) {
    return true;
  }
  
  // Initial two square move
  if (fromRow === startRow && deltaCol === 0 && deltaRow === 2 * direction &&
      !board[toRow][toCol] && !board[fromRow + direction][fromCol]) {
    return true;
  }
  
  // Capture moves
  if (Math.abs(deltaCol) === 1 && deltaRow === direction) {
    return board[toRow][toCol] && board[toRow][toCol].color !== piece.color;
  }
  
  return false;
};

const isValidRookMove = (fromRow, fromCol, toRow, toCol, board) => {
  if (fromRow !== toRow && fromCol !== toCol) return false;
  
  const rowDir = Math.sign(toRow - fromRow);
  const colDir = Math.sign(toCol - fromCol);
  
  let currentRow = fromRow + rowDir;
  let currentCol = fromCol + colDir;
  
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowDir;
    currentCol += colDir;
  }
  
  return true;
};

const isValidKnightMove = (deltaRow, deltaCol) => {
  return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
         (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);
};

const isValidBishopMove = (fromRow, fromCol, toRow, toCol, board) => {
  if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
  
  const rowDir = Math.sign(toRow - fromRow);
  const colDir = Math.sign(toCol - fromCol);
  
  let currentRow = fromRow + rowDir;
  let currentCol = fromCol + colDir;
  
  while (currentRow !== toRow && currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowDir;
    currentCol += colDir;
  }
  
  return true;
};

const isValidQueenMove = (fromRow, fromCol, toRow, toCol, board) => {
  return isValidRookMove(fromRow, fromCol, toRow, toCol, board) ||
         isValidBishopMove(fromRow, fromCol, toRow, toCol, board);
};

const isValidKingMove = (deltaRow, deltaCol) => {
  return Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1;
};

// Check if a king is in check
export const isInCheck = (board, color) => {
  // Find king position
  let kingRow, kingCol;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
  }

  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        if (isValidMove(piece, row, col, kingRow, kingCol, board)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Check if a move would put or leave the king in check
export const wouldBeInCheck = (board, fromRow, fromCol, toRow, toCol, color) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  return isInCheck(newBoard, color);
};

// Convert board position to chess notation
export const toChessNotation = (row, col) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[col]}${8 - row}`;
};
