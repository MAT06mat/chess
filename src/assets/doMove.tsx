import { piece } from "../game/Piece";
import playSound from "../game/Sounds";
import doSpecialMove from "./doSpecialMove";
import { move } from "./getMoves";

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

    let newPieces = pieces.filter((piece) => {
        return !(piece.x === x && piece.y === y);
    });

    if (validMove.type) {
        playSound("capture");
    } else if (validMove.special === "promotion") {
        playSound("promote");
    } else if (validMove.special === "castling") {
        playSound("castle");
    } else {
        playSound("move-self");
    }

    newPieces.map((piece) => {
        if (piece === selectedPiece) {
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
