import { completeMove, move } from "../../types";
import piece from "../../types/piece";
import doMove from "./doMove";
import getPieceValidMoves from "./getPieceValidMoves";
import isCheck from "../isCheck";

function getValidMoves(
    colorToPlay: "w" | "b",
    pieces: piece[],
    lastMove: completeMove | null
): [Map<number, move[]>, number] {
    let numberOfMove = 0;
    const map = new Map();
    const piecesToPlay = pieces.filter(
        (piece) => piece.type[0] === colorToPlay
    );
    piecesToPlay.forEach((piece) => {
        const validMoves = getPieceValidMoves(piece, pieces, lastMove);
        const validMovesWithNoCheck = validMoves.filter(
            (move) => !isCheck(colorToPlay, doMove(move, piece, pieces))
        );
        numberOfMove += validMovesWithNoCheck.length;
        map.set(piece.id, validMovesWithNoCheck);
    });
    return [map, numberOfMove];
}

export default getValidMoves;
