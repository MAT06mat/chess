import { CompleteMove } from "../types";

export const colToNum = (s: string) => s.charCodeAt(0) - "a".charCodeAt(0);

export const numToCol = (n: number) => String.fromCharCode(97 + n);

export const coordsToSquare = (x: number, y: number) => numToCol(x) + (y + 1);

export const squareToCoords = (square: string) => ({
    x: colToNum(square),
    y: parseInt(square[1], 10) - 1,
});

export const moveToSan = (move: CompleteMove) => {
    const checkSymbol = move.checkMate ? "#" : move.check ? "+" : "";

    // Handle castling
    if (move.special === "castling") {
        return (move.toX === 6 ? "0-0" : "0-0-0") + checkSymbol;
    }

    const isPawn = move.piece.type === "p";
    const isPawnCapture = isPawn && move.capture;
    const pieceSymbol = isPawn ? "" : move.piece.type.toUpperCase();
    const fromCol = isPawnCapture ? numToCol(move.fromX) : "";
    const captureSymbol = move.capture ? "x" : "";
    const square = coordsToSquare(move.toX, move.toY);
    const promotion =
        move.special === "promotion" && move.toPiece
            ? `=${move.toPiece.type.toUpperCase()}`
            : "";
    const enPassant = move.special === "enPassant" ? " e.p." : "";

    return `${pieceSymbol}${fromCol}${captureSymbol}${square}${promotion}${checkSymbol}${enPassant}`;
};

const SQUARE_SIZE = 12.5;
const HALF_SQUARE = SQUARE_SIZE / 2;

export const squareToBoardCoords = (
    square: string,
    invertedColor?: boolean
) => {
    const coord = squareToCoords(square);

    const x = coord.x * SQUARE_SIZE + HALF_SQUARE;
    const y = coord.y * SQUARE_SIZE + HALF_SQUARE;

    if (invertedColor) {
        return [100 - x, y];
    }
    return [x, 100 - y];
};
