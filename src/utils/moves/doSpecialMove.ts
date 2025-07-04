import { completeMove } from "../../types";
import piece from "../../types/piece";

/**
 * Handles special moves like castling for a piece based on the valid move provided.
 * If the move is castling, it moves the rook to the appropriate position.
 * If the move is en passant, it removes the captured pawn.
 *
 * @param {completeMove} move - The valid move object containing all informations.
 * @param {piece[]} pieces - The current list of pieces on the board.
 * @returns {piece[]} - This function does not return anything, it modifies the pieces array directly.
 */
function doSpecialMove(move: completeMove, pieces: piece[]): piece[] {
    const x = move.toX - move.fromX;
    if (move.special === "castling" && move.piece.type[1] === "k") {
        const rookX = x === 2 ? 7 : x === -2 ? 0 : null;
        const newRookX = x === 2 ? 5 : x === -2 ? 3 : null;
        if (rookX !== null && newRookX !== null) {
            // Move the rook
            const rook = pieces.find(
                (p) =>
                    p.type[1] === "r" &&
                    p.type[0] === move.piece.type[0] &&
                    p.x === rookX
            );
            if (rook) {
                rook.x = newRookX;
                rook.hasMoved = true;
            }
        }
    } else if (move.special === "enPassant") {
        // Remove the captured pawn
        pieces = pieces.filter(
            (p) =>
                !(
                    p.type[1] === "p" &&
                    p.y === move.piece.y &&
                    p.x === move.piece.x + x
                )
        );
    } else if (move.special === "promotion") {
        pieces = pieces.map((piece) => {
            if (piece.id === move.toPiece?.id) {
                return {
                    ...piece,
                    type: move.toPiece.type,
                    hasMoved: true,
                };
            }
            return piece;
        });
    }

    return pieces;
}

export default doSpecialMove;
