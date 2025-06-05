import { piece } from "../game/Piece";
import { move } from "./getMoves";

/**
 * Handles special moves like castling for a piece based on the valid move provided.
 * If the move is castling, it moves the rook to the appropriate position.
 * TODO: Extend this function to handle other special moves like en passant and promotion.
 *
 * @param {move} validMove - The valid move object containing x and y offsets.
 * @param {piece} piece - The piece being moved.
 * @param {piece[]} pieces - The current list of pieces on the board.
 * @returns {void} - This function does not return anything, it modifies the pieces array directly.
 */
function doSpecialMove(validMove: move, piece: piece, pieces: piece[]): void {
    if (validMove.special === "castling") {
        if (piece.type[1] === "k") {
            if (validMove.x === 2) {
                // Move the rook
                const rook = pieces.find(
                    (p) =>
                        p.type[1] === "r" &&
                        p.type[0] === piece.type[0] &&
                        p.x === 7
                );
                if (rook) {
                    rook.x = 5;
                    rook.hasMoved = true;
                }
            } else if (validMove.x === -2) {
                // Move the rook
                const rook = pieces.find(
                    (p) =>
                        p.type[1] === "r" &&
                        p.type[0] === piece.type[0] &&
                        p.x === 0
                );
                if (rook) {
                    rook.x = 3;
                    rook.hasMoved = true;
                }
            }
        }
    }

    // TODO: Handle other special moves like en passant, promotion, etc.
}

export default doSpecialMove;
