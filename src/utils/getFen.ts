import { completeMove } from "../types";
import boardPosition from "../types/boardPosition";
import piece from "../types/piece";

function getFen(
    pieces: piece[],
    completeMove: completeMove,
    colorToPlay: "w" | "b",
    movesHistory: boardPosition[],
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
                if (piece.type[0] === "w") {
                    fen += piece.type[1].toUpperCase();
                } else {
                    fen += piece.type[1].toLowerCase();
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
        if (piece.type === "wk" && !piece.hasMoved) {
            if (
                pieces.some((p) => p.type === "wr" && !p.hasMoved && p.x === 7)
            ) {
                rights += "K"; // White king-side castling
            }
            if (
                pieces.some((p) => p.type === "wr" && !p.hasMoved && p.x === 0)
            ) {
                rights += "Q"; // White queen-side castling
            }
        }
        if (piece.type === "bk" && !piece.hasMoved) {
            if (
                pieces.some((p) => p.type === "br" && !p.hasMoved && p.x === 7)
            ) {
                rights += "k"; // Black king-side castling
            }
            if (
                pieces.some((p) => p.type === "br" && !p.hasMoved && p.x === 0)
            ) {
                rights += "q"; // Black queen-side castling
            }
        }
        return rights;
    });

    fen += rights || "-";

    // API DON'T SUPPORT THAT -> idk
    /*const lastMove = movesHistory[actualMove].lastMove;
    if (
        lastMove &&
        lastMove.piece.type[1] === "p" &&
        Math.abs(lastMove.fromY - lastMove.toY) === 2
    ) {
        const targetX = lastMove.toX;
        const targetY = (lastMove.toY + lastMove.fromY) / 2;
        if (invertedColor) {
            fen += ` ${String.fromCharCode(97 + (7 - targetX))}${8 - targetY}`;
        } else {
            fen += ` ${String.fromCharCode(97 + targetX)}${targetY + 1}`;
        }
    } else {
        fen += " -";
    }*/

    fen += " -";

    let halfMoveClock = 0;
    let stopClock = false;
    if (completeMove.piece.type[1] !== "p" && !completeMove.capture) {
        structuredClone(movesHistory)
            .reverse()
            .forEach((move) => {
                if (
                    move.lastMove &&
                    move.lastMove.piece.type[1] !== "p" &&
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
