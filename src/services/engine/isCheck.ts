import { Piece } from "../../types";
import getPieceValidMoves from "./getPieceValidMoves";

function isCheck(
    color: string,
    pieces: Piece[],
    relativeX?: number[]
): boolean {
    const king = pieces.find(
        (piece) => piece.type === "k" && piece.color === color
    );
    if (!king) return false;
    const kingInit: Piece = { ...king };

    if (!relativeX) {
        relativeX = [0];
    }

    const result = relativeX.some((n) => {
        king.x = kingInit.x + n;
        return pieces.some((piece) => {
            if (piece.color === color) return false;

            const moveX = king.x - piece.x;
            const moveY = king.y - piece.y;

            const validMoves = getPieceValidMoves(
                piece,
                pieces,
                null,
                true
            ).filter((move) => move.capture);

            return validMoves.some(
                (move) => move.x === moveX && move.y === moveY
            );
        });
    });
    king.x = kingInit.x;
    return result;
}

export default isCheck;
