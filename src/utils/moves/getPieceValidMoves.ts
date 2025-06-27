import { completeMove } from "../../types";
import piece from "../../types/piece";
import getPieceMoves from "./getPieceMoves";
import isCheck from "../isCheck";
import isPosInBoard from "../isPosInBoard";

function getPieceValidMoves(
    selectedPiece: piece,
    pieces: piece[],
    lastMove: completeMove | null,
    noCheck?: boolean
) {
    const isWhite = selectedPiece.type[0] === "w";
    const isPawn = selectedPiece.type[1] === "p";
    const isKing = selectedPiece.type[1] === "k";

    const groupBlocked = new Set<number>(
        isPawn ? (isWhite ? [0, 1, 2] : [3, 4, 5]) : []
    );

    const potentialMoves = getPieceMoves(selectedPiece.type[1]);

    return potentialMoves.filter((move) => {
        if (move.group !== undefined && groupBlocked.has(move.group)) {
            return false;
        }

        const targetX = move.x + selectedPiece.x;
        const targetY = move.y + selectedPiece.y;

        if (!isPosInBoard(targetX, targetY)) return false;

        const targetPiece = pieces.find(
            (p) => p.x === targetX && p.y === targetY
        );
        const isSameColor = targetPiece?.type[0] === selectedPiece.type[0];
        const isEnemy = targetPiece
            ? targetPiece.type[0] !== selectedPiece.type[0]
            : false;

        // Prevent friendly fire or forward pawn capturing
        if (isSameColor || (isPawn && move.x === 0 && isEnemy)) {
            if (move.group !== undefined) {
                groupBlocked.add(move.group);
            }
            return false;
        }

        // --- PAWN LOGIC ---
        if (isPawn) {
            // Capture
            if (move.x !== 0) {
                if (isEnemy) {
                    move.capture = true;
                } else if (
                    lastMove &&
                    lastMove.piece.type[1] === "p" &&
                    lastMove.piece.type[0] !== selectedPiece.type[0] &&
                    Math.abs(lastMove.fromY - lastMove.toY) === 2 &&
                    lastMove.toX === targetX &&
                    lastMove.toY === selectedPiece.y
                ) {
                    move.special = "enPassant";
                    move.capture = true;
                } else {
                    return false;
                }
            }

            if (Math.abs(move.y) === 2 && selectedPiece.hasMoved) return false;

            // Promotion
            if ((isWhite && targetY === 7) || (!isWhite && targetY === 0)) {
                move.special = "promotion";
            }
        }

        // --- KING LOGIC (Castle) ---
        if (isKing && (move.x === 2 || move.x === -2)) {
            if (selectedPiece.hasMoved || isEnemy) return false;

            const isKingside = move.x === 2;
            const rookX = isKingside ? 7 : 0;
            const rook = pieces.find(
                (p) =>
                    p.type[1] === "r" &&
                    p.type[0] === selectedPiece.type[0] &&
                    p.x === rookX &&
                    !p.hasMoved
            );

            if (!rook) return false;

            // Blocked squares
            if (
                !isKingside &&
                pieces.some((p) => p.x === 1 && p.y === selectedPiece.y)
            ) {
                return false;
            }

            const intermediateSquares = isKingside
                ? [0, 1, 3]
                : [0, -1, -3, -4];

            if (
                !noCheck &&
                isCheck(selectedPiece.type[0], pieces, intermediateSquares)
            ) {
                return false;
            }

            move.special = "castling";
        }

        if (isEnemy) {
            if (move.group !== undefined) {
                groupBlocked.add(move.group);
            }
            move.capture = true;
            return true;
        }

        return true;
    });
}

export default getPieceValidMoves;
