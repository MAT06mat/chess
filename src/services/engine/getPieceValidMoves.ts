import { CompleteMove, Piece } from "../../types";
import { isCoordsInBoard } from "../../utils/helpers";
import getPieceMoves from "./getPieceMoves";
import isCheck from "./isCheck";

function getPieceValidMoves(
    selectedPiece: Piece,
    pieces: Piece[],
    lastMove: CompleteMove | null,
    noCheck?: boolean
) {
    const isWhite = selectedPiece.color === "w";
    const isPawn = selectedPiece.type === "p";
    const isKing = selectedPiece.type === "k";

    const groupBlocked = new Set<number>(
        isPawn ? (isWhite ? [0, 1, 2] : [3, 4, 5]) : []
    );

    const potentialMoves = getPieceMoves(selectedPiece.type);

    return potentialMoves.filter((move) => {
        if (move.group !== undefined && groupBlocked.has(move.group)) {
            return false;
        }

        const target = {
            x: move.x + selectedPiece.x,
            y: move.y + selectedPiece.y,
        };

        if (!isCoordsInBoard(target)) return false;

        const targetPiece = pieces.find(
            (p) => p.x === target.x && p.y === target.y
        );
        const isSameColor = targetPiece?.color === selectedPiece.color;
        const isEnemy = targetPiece
            ? targetPiece.color !== selectedPiece.color
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
                    lastMove.piece.type === "p" &&
                    lastMove.piece.color !== selectedPiece.color &&
                    Math.abs(lastMove.fromY - lastMove.toY) === 2 &&
                    lastMove.toX === target.x &&
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
            if ((isWhite && target.y === 7) || (!isWhite && target.y === 0)) {
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
                    p.type === "r" &&
                    p.color === selectedPiece.color &&
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

            if (
                !noCheck &&
                isCheck(selectedPiece.color, pieces, [0, isKingside ? 1 : -1])
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
