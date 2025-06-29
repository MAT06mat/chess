import { completeMove, move } from "../../types";
import piece from "../../types/piece";
import getChessNotation from "../getChessNotation";

function getCompleteMove(move: move, selectedPiece: piece): completeMove {
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

    completeMove.san = getChessNotation(completeMove);

    return completeMove;
}

export default getCompleteMove;
