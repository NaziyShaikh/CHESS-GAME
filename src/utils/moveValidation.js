export function getLegalMoves(board, row, col, piece) {
    const moves = [];
    const isWhite = piece === piece.toUpperCase();

    switch (piece.toLowerCase()) {
        case 'p': // Pawn
            const direction = isWhite ? -1 : 1;
            if (board[row + direction]?.[col] === null) {
                moves.push({ row: row + direction, col });
                if ((isWhite && row === 6) || (!isWhite && row === 1)) {
                    if (board[row + (2 * direction)]?.[col] === null) {
                        moves.push({ row: row + (2 * direction), col });
                    }
                }
            }
            [-1, 1].forEach(offset => {
                const newCol = col + offset;
                if (board[row + direction]?.[newCol] !== undefined) {
                    const targetPiece = board[row + direction][newCol];
                    if (targetPiece && isWhite !== (targetPiece === targetPiece.toUpperCase())) {
                        moves.push({ row: row + direction, col: newCol });
                    }
                }
            });
            break;

        case 'r': // Rook
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col] !== undefined) {
                    if (board[row + i][col] === null) {
                        moves.push({ row: row + i, col });
                    } else if (isWhite !== (board[row + i][col] === board[row + i][col].toUpperCase())) {
                        moves.push({ row: row + i, col });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col] !== undefined) {
                    if (board[row - i][col] === null) {
                        moves.push({ row: row - i, col });
                    } else if (isWhite !== (board[row - i][col] === board[row - i][col].toUpperCase())) {
                        moves.push({ row: row - i, col });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row]?.[col + i] !== undefined) {
                    if (board[row][col + i] === null) {
                        moves.push({ row, col: col + i });
                    } else if (isWhite !== (board[row][col + i] === board[row][col + i].toUpperCase())) {
                        moves.push({ row, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row]?.[col - i] !== undefined) {
                    if (board[row][col - i] === null) {
                        moves.push({ row, col: col - i });
                    } else if (isWhite !== (board[row][col - i] === board[row][col - i].toUpperCase())) {
                        moves.push({ row, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'n': // Knight
            const knightMoves = [
                { row: row + 2, col: col + 1 },
                { row: row + 2, col: col - 1 },
                { row: row - 2, col: col + 1 },
                { row: row - 2, col: col - 1 },
                { row: row + 1, col: col + 2 },
                { row: row + 1, col: col - 2 },
                { row: row - 1, col: col + 2 },
                { row: row - 1, col: col - 2 },
            ];
            knightMoves.forEach(move => {
                if (board[move.row]?.[move.col] !== undefined) {
                    if (board[move.row][move.col] === null || isWhite !== (board[move.row][move.col] === board[move.row][move.col].toUpperCase())) {
                        moves.push(move);
                    }
                }
            });
            break;

        case 'b': // Bishop
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col + i] !== undefined) {
                    if (board[row + i][col + i] === null) {
                        moves.push({ row: row + i, col: col + i });
                    } else if (isWhite !== (board[row + i][col + i] === board[row + i][col + i].toUpperCase())) {
                        moves.push({ row: row + i, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col - i] !== undefined) {
                    if (board[row + i][col - i] === null) {
                        moves.push({ row: row + i, col: col - i });
                    } else if (isWhite !== (board[row + i][col - i] === board[row + i][col - i].toUpperCase())) {
                        moves.push({ row: row + i, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col + i] !== undefined) {
                    if (board[row - i][col + i] === null) {
                        moves.push({ row: row - i, col: col + i });
                    } else if (isWhite !== (board[row - i][col + i] === board[row - i][col + i].toUpperCase())) {
                        moves.push({ row: row - i, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col - i] !== undefined) {
                    if (board[row - i][col - i] === null) {
                        moves.push({ row: row - i, col: col - i });
                    } else if (isWhite !== (board[row - i][col - i] === board[row - i][col - i].toUpperCase())) {
                        moves.push({ row: row - i, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'q': // Queen
            // Combine rook and bishop movement
            // Rook-like moves
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col] !== undefined) {
                    if (board[row + i][col] === null) {
                        moves.push({ row: row + i, col });
                    } else if (isWhite !== (board[row + i][col] === board[row + i][col].toUpperCase())) {
                        moves.push({ row: row + i, col });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col] !== undefined) {
                    if (board[row - i][col] === null) {
                        moves.push({ row: row - i, col });
                    } else if (isWhite !== (board[row - i][col] === board[row - i][col].toUpperCase())) {
                        moves.push({ row: row - i, col });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row]?.[col + i] !== undefined) {
                    if (board[row][col + i] === null) {
                        moves.push({ row, col: col + i });
                    } else if (isWhite !== (board[row][col + i] === board[row][col + i].toUpperCase())) {
                        moves.push({ row, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row]?.[col - i] !== undefined) {
                    if (board[row][col - i] === null) {
                        moves.push({ row, col: col - i });
                    } else if (isWhite !== (board[row][col - i] === board[row][col - i].toUpperCase())) {
                        moves.push({ row, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            // Bishop-like moves
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col + i] !== undefined) {
                    if (board[row + i][col + i] === null) {
                        moves.push({ row: row + i, col: col + i });
                    } else if (isWhite !== (board[row + i][col + i] === board[row + i][col + i].toUpperCase())) {
                        moves.push({ row: row + i, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row + i]?.[col - i] !== undefined) {
                    if (board[row + i][col - i] === null) {
                        moves.push({ row: row + i, col: col - i });
                    } else if (isWhite !== (board[row + i][col - i] === board[row + i][col - i].toUpperCase())) {
                        moves.push({ row: row + i, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col + i] !== undefined) {
                    if (board[row - i][col + i] === null) {
                        moves.push({ row: row - i, col: col + i });
                    } else if (isWhite !== (board[row - i][col + i] === board[row - i][col + i].toUpperCase())) {
                        moves.push({ row: row - i, col: col + i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8; i++) {
                if (board[row - i]?.[col - i] !== undefined) {
                    if (board[row - i][col - i] === null) {
                        moves.push({ row: row - i, col: col - i });
                    } else if (isWhite !== (board[row - i][col - i] === board[row - i][col - i].toUpperCase())) {
                        moves.push({ row: row - i, col: col - i });
                        break;
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'k': // King
            const kingMoves = [
                { row: row + 1, col },
                { row: row - 1, col },
                { row, col: col + 1 },
                { row, col: col - 1 },
                { row: row + 1, col: col + 1 },
                { row: row + 1, col: col - 1 },
                { row: row - 1, col: col + 1 },
                { row: row - 1, col: col - 1 },
            ];
            kingMoves.forEach(move => {
                if (board[move.row]?.[move.col] !== undefined) {
                    if (board[move.row][move.col] === null || isWhite !== (board[move.row][move.col] === board[move.row][move.col].toUpperCase())) {
                        moves.push(move);
                    }
                }
            });
            break;

        default:
            break;
    }

    return moves;
}
