import piece from "./piece";

interface move {
    x: number;
    y: number;
    group: number;
    type?: string;
    special?: "enPassant" | "castling" | "promotion";
}

interface completeMove {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    piece: piece;
    toPiece?: piece;
}

export type { move };
export type { completeMove };
