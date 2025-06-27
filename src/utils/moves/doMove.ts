import { completeMove } from "../../types";
import piece from "../../types/piece";
import doSpecialMove from "./doSpecialMove";

/**
 * Moves a piece to a new position based on the valid move provided.
 * If the move captures another piece, it removes that piece from the game.
 * If the move is a special move, it handles that as well.
 *
 * @param {completeMove} move - The valid move object containing all informations.
 * @param {piece[]} pieces - The current list of pieces on the board.
 * @returns {piece[]} - The updated list of pieces after the move.
 */
function doMove(move: completeMove, pieces: piece[]): piece[] {
    let newPieces = structuredClone(pieces).filter((piece) => {
        return !(piece.x === move.toX && piece.y === move.toY);
    });

    newPieces.map((piece) => {
        if (piece.id === move.piece.id) {
            piece.x = move.toX;
            piece.y = move.toY;
            piece.hasMoved = true;
        }
        return piece;
    });

    newPieces = doSpecialMove(move, newPieces);

    return newPieces;
}

export default doMove;
