import { CompleteMove, RelativeMove, Piece } from "../../types";
import doMove from "./doMove";
import getPieceValidMoves from "./getPieceValidMoves";
import isCheck from "./isCheck";
import getCompleteMove from "./getCompleteMove";

function getValidMoves(
    colorToPlay: "w" | "b" | "wb",
    pieces: Piece[],
    lastMove: CompleteMove | null
): [Map<number, RelativeMove[]>, number] {
    let numberOfMove = 0;
    const map = new Map();
    if (colorToPlay === "wb") {
        pieces.forEach((piece) => {
            map.set(piece.id, getPieceValidMoves(piece, pieces, lastMove));
        });
        return [map, 999];
    }
    const piecesToPlay = pieces.filter((piece) => piece.color === colorToPlay);
    piecesToPlay.forEach((piece) => {
        const validMoves = getPieceValidMoves(piece, pieces, lastMove);

        const validMovesWithNoCheck = validMoves.filter(
            (move) =>
                !isCheck(
                    colorToPlay,
                    doMove(getCompleteMove(move, piece), pieces)
                )
        );
        numberOfMove += validMovesWithNoCheck.length;
        map.set(piece.id, validMovesWithNoCheck);
    });
    return [map, numberOfMove];
}

export default getValidMoves;
