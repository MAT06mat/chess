import { CompleteMove, Piece, BoardPosition } from "../types";

function getFen(
    pieces: Piece[],
    completeMove: CompleteMove,
    colorToPlay: "w" | "b",
    movesHistory: BoardPosition[],
    actualMove: number
): string {
    let fen = "";
    let emptyCount = 0;

    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const piece = pieces.find((p) => p.x === col && p.y === row);
            if (piece === undefined) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount.toString();
                    emptyCount = 0;
                }
                if (piece.color === "w") {
                    fen += piece.type.toUpperCase();
                } else {
                    fen += piece.type.toLowerCase();
                }
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount.toString();
            emptyCount = 0;
        }
        if (row > 0) {
            fen += "/";
        }
    }

    fen += ` ${colorToPlay} `;

    let rights = "";
    pieces.forEach((piece) => {
        if (piece.type === "k" && piece.color === "w" && !piece.hasMoved) {
            if (
                pieces.some(
                    (p) =>
                        p.type === "r" &&
                        p.color === "w" &&
                        !p.hasMoved &&
                        p.x === 7
                )
            ) {
                rights += "K"; // White king-side castling
            }
            if (
                pieces.some(
                    (p) =>
                        p.type === "r" &&
                        p.color === "w" &&
                        !p.hasMoved &&
                        p.x === 0
                )
            ) {
                rights += "Q"; // White queen-side castling
            }
        }
        if (piece.type === "k" && piece.color === "b" && !piece.hasMoved) {
            if (
                pieces.some(
                    (p) =>
                        p.type === "r" &&
                        p.color === "b" &&
                        !p.hasMoved &&
                        p.x === 7
                )
            ) {
                rights += "k"; // Black king-side castling
            }
            if (
                pieces.some(
                    (p) =>
                        p.type === "r" &&
                        p.color === "b" &&
                        !p.hasMoved &&
                        p.x === 0
                )
            ) {
                rights += "q"; // Black queen-side castling
            }
        }
        return rights;
    });

    fen += rights || "-";

    // API DON'T SUPPORT THAT -> idk
    /* if (
        lastMove &&
        lastMove.piece.type === "p" &&
        Math.abs(lastMove.fromY - lastMove.toY) === 2
    ) {
        const targetX = lastMove.toX;
        const targetY = (lastMove.toY + lastMove.fromY) / 2;
        if (invertedColor) {
            fen += ` ${numToCol(7 - targetX)}${8 - targetY}`;
        } else {
            fen += ` ${coordToPos(targetX, targetY)}`;
        }
    } else {
        fen += " -";
    }*/

    fen += " -";

    let halfMoveClock = 0;
    let stopClock = false;
    if (completeMove.piece.type !== "p" && !completeMove.capture) {
        structuredClone(movesHistory)
            .reverse()
            .forEach((move) => {
                if (
                    move.lastMove &&
                    move.lastMove.piece.type !== "p" &&
                    !move.lastMove.capture &&
                    !stopClock
                ) {
                    halfMoveClock++;
                } else {
                    stopClock = true;
                }
            });
    }

    fen += ` ${halfMoveClock + 1}`;

    fen += " " + (Math.floor((actualMove + 1) / 2) + 1).toString();
    return fen;
}

export default getFen;
