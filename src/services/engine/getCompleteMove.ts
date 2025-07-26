import { CompleteMove, RelativeMove, Piece } from "../../types";
import { moveToSan } from "../../utils/formatting";

function getcompleteMove(
    move: RelativeMove,
    selectedPiece: Piece
): CompleteMove {
    const completeMove = {
        fromX: selectedPiece.x,
        fromY: selectedPiece.y,
        toX: selectedPiece.x + move.x,
        toY: selectedPiece.y + move.y,
        capture: move.capture,
        check: move.check,
        special: move.special,
        piece: selectedPiece,
        san: "",
    };

    completeMove.san = moveToSan(completeMove);

    return completeMove;
}

export default getcompleteMove;
