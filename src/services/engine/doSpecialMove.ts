import { CompleteMove, Piece } from "../../types";

/**
 * Handles special moves like castling for a piece based on the valid move provided.
 * If the move is castling, it moves the rook to the appropriate position.
 * If the move is en passant, it removes the captured pawn.
 *
 * @param {CompleteMove} move - The valid move object containing all informations.
 * @param {Piece[]} pieces - The current list of pieces on the board.
 * @returns {Piece[]} - This function does not return anything, it modifies the pieces array directly.
 */
function doSpecialMove(move: CompleteMove, pieces: Piece[]): Piece[] {
    const x = move.toX - move.fromX;
    if (move.special === "castling" && move.piece.type === "k") {
        const rookX = x === 2 ? 7 : x === -2 ? 0 : null;
        const newRookX = x === 2 ? 5 : x === -2 ? 3 : null;
        if (rookX !== null && newRookX !== null) {
            // Move the rook
            const rook = pieces.find(
                (p) =>
                    p.type === "r" &&
                    p.color === move.piece.color &&
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
                    p.type === "p" &&
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
