import piece from "./piece";

interface type {
    capture?: boolean;
    check?: boolean;
    checkMate?: boolean;
    special?: "enPassant" | "castling" | "promotion";
}

interface move extends type {
    x: number;
    y: number;
    group?: number;
}

interface completeMove extends type {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    piece: piece;
    toPiece?: piece;
}

export type { move };
export type { completeMove };
