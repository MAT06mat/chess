import { piece } from "../game/Piece";
import getMoves, { completeMove } from "./getMoves";
import isPosInBoard from "./isPosInBoard";

function getValidMoves(
    selectedPiece: piece | null,
    pieces: piece[],
    lastMove: completeMove | null
) {
    if (!selectedPiece) {
        return [];
    }

    const groupBlocked: number[] =
        selectedPiece.type[1] === "p"
            ? selectedPiece.type[0] === "w"
                ? [0, 1, 2]
                : [3, 4, 5]
            : [];

    return getMoves(selectedPiece.type[1]).filter((Move) => {
        const x = Move.x + selectedPiece.x;
        const y = Move.y + selectedPiece.y;

        const isOccupiedSameColor = pieces.some(
            (piece) =>
                piece.x === x &&
                piece.y === y &&
                (piece.type[0] === selectedPiece.type[0] ||
                    (selectedPiece.type[1] === "p" && Move.x === 0))
        );
        const isOccupiedOtherColor = pieces.some(
            (piece) =>
                piece.x === x &&
                piece.y === y &&
                piece.type[0] !== selectedPiece.type[0]
        );

        Move.type = undefined;
        Move.special = undefined;

        if (selectedPiece.type[1] === "p") {
            if (
                lastMove &&
                Math.abs(lastMove.fromY - y) === 1 &&
                Math.abs(lastMove.toY - y) === 1 &&
                lastMove.fromX === x &&
                lastMove.piece.type[1] === "p" &&
                lastMove.piece.type[0] !== selectedPiece.type[0]
            ) {
                Move.special = "enPassant";
                Move.type = "capture-hint";
            }

            if (Move.x !== 0 && !isOccupiedOtherColor && !Move.special) {
                return false;
            }

            if (selectedPiece.hasMoved && (Move.y === 2 || Move.y === -2)) {
                return false;
            }

            if (
                (selectedPiece.y === 6 && selectedPiece.type[0] === "w") ||
                (selectedPiece.y === 1 && selectedPiece.type[0] === "b")
            ) {
                Move.special = "promotion";
            }
        }

        if (selectedPiece.type[1] === "k") {
            if (Move.x === 2) {
                if (selectedPiece.hasMoved || isOccupiedOtherColor) {
                    return false;
                }
                if (
                    !pieces.some(
                        (piece) =>
                            piece.type[1] === "r" &&
                            piece.type[0] === selectedPiece.type[0] &&
                            piece.x === 7 &&
                            !piece.hasMoved
                    )
                ) {
                    return false;
                }
                Move.special = "castling";
            }
            if (Move.x === -2) {
                if (selectedPiece.hasMoved || isOccupiedOtherColor) {
                    return false;
                }
                if (
                    !pieces.some(
                        (piece) =>
                            piece.type[1] === "r" &&
                            piece.type[0] === selectedPiece.type[0] &&
                            piece.x === 0 &&
                            !piece.hasMoved
                    ) ||
                    pieces.some(
                        (piece) => piece.x === 1 && piece.y === selectedPiece.y
                    )
                ) {
                    return false;
                }
                Move.special = "castling";
            }
        }

        if (groupBlocked.includes(Move.group)) {
            return false;
        }

        if (isOccupiedOtherColor || isOccupiedSameColor) {
            groupBlocked.push(Move.group);
            if (isOccupiedSameColor) {
                return false;
            } else if (isOccupiedOtherColor) {
                Move.type = "capture-hint";
                return true;
            }
        }

        return isPosInBoard(x, y);
    });
}

export default getValidMoves;
