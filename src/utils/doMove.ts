import { move } from "../types";
import piece from "../types/piece";
import doSpecialMove from "./doSpecialMove";

/**
 * Moves a piece to a new position based on the valid move provided.
 * If the move captures another piece, it removes that piece from the game.
 * If the move is a special move, it handles that as well.
 *
 * @param {move} validMove - The valid move object containing x and y offsets.
 * @param {piece} selectedPiece - The piece being moved.
 * @param {piece[]} pieces - The current list of pieces on the board.
 * @returns {piece[]} - The updated list of pieces after the move.
 */
function doMove(
    validMove: move,
    selectedPiece: piece,
    pieces: piece[]
): piece[] {
    const x = selectedPiece.x + validMove.x;
    const y = selectedPiece.y + validMove.y;

    let newPieces = structuredClone(pieces).filter((piece) => {
        return !(piece.x === x && piece.y === y);
    });

    newPieces.map((piece) => {
        if (piece.id === selectedPiece.id) {
            piece.x = x;
            piece.y = y;
            piece.hasMoved = true;
        }
        return piece;
    });

    newPieces = doSpecialMove(validMove, selectedPiece, newPieces);

    return newPieces;
}

export default doMove;
