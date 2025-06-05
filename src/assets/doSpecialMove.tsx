import { piece } from "../game/Piece";
import { move } from "./getMoves";

/**
 * Handles special moves like castling for a piece based on the valid move provided.
 * If the move is castling, it moves the rook to the appropriate position.
 * If the move is en passant, it removes the captured pawn.
 * TODO: Extend this function to handle pawn promotion.
 *
 * @param {move} validMove - The valid move object containing x and y offsets.
 * @param {piece} piece - The piece being moved.
 * @param {piece[]} pieces - The current list of pieces on the board.
 * @returns {piece[]} - This function does not return anything, it modifies the pieces array directly.
 */
function doSpecialMove(
    validMove: move,
    piece: piece,
    pieces: piece[]
): piece[] {
    if (validMove.special === "castling" && piece.type[1] === "k") {
        const rookX = validMove.x === 2 ? 7 : validMove.x === -2 ? 0 : null;
        const newRookX = validMove.x === 2 ? 5 : validMove.x === -2 ? 3 : null;
        if (rookX !== null && newRookX !== null) {
            // Move the rook
            const rook = pieces.find(
                (p) =>
                    p.type[1] === "r" &&
                    p.type[0] === piece.type[0] &&
                    p.x === rookX
            );
            if (rook) {
                rook.x = newRookX;
                rook.hasMoved = true;
            }
        }
    } else if (validMove.special === "enPassant") {
        // Remove the captured pawn
        pieces = pieces.filter(
            (p) =>
                !(
                    p.type[1] === "p" &&
                    p.y === piece.y - validMove.y &&
                    p.x === piece.x
                )
        );
    }

    // TODO: Handle other special moves like promotion, etc.

    return pieces;
}

export default doSpecialMove;
