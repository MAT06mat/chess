import { completeMove, move } from "../../types";
import piece from "../../types/piece";

function getCompleteMove(move: move, selectedPiece: piece): completeMove {
    return {
        fromX: selectedPiece.x,
        fromY: selectedPiece.y,
        toX: selectedPiece.x + move.x,
        toY: selectedPiece.y + move.y,
        capture: move.capture,
        check: move.check,
        special: move.special,
        piece: selectedPiece,
    };
}

export default getCompleteMove;
