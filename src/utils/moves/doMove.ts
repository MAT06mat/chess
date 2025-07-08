import { CompleteMove, Piece } from "../../types";
import doSpecialMove from "./doSpecialMove";

/**
 * Moves a piece to a new position based on the valid move provided.
 * If the move captures another piece, it removes that piece from the game.
 * If the move is a special move, it handles that as well.
 *
 * @param {CompleteMove} move - The valid move object containing all informations.
 * @param {Piece[]} pieces - The current list of pieces on the board.
 * @returns {Piece[]} - The updated list of pieces after the move.
 */
function doMove(move: CompleteMove, pieces: Piece[]): Piece[] {
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
