import piece from "../../types/piece";
import getPieceValidMoves from "./getPieceValidMoves";

function isCheck(
    color: string,
    pieces: piece[],
    relativeX?: number[]
): boolean {
    const king = pieces.find((piece) => piece.type === color + "k");
    if (!king) return false;
    const kingInit: piece = { ...king };

    if (!relativeX) {
        relativeX = [0];
    }

    const result = relativeX.some((n) => {
        king.x = kingInit.x + n;
        return pieces.some((piece) => {
            if (piece.type[0] === color) return false;

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
