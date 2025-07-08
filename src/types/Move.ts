import { Piece } from "./Piece";

interface BaseMove {
    capture?: boolean;
    check?: boolean;
    checkMate?: boolean;
    special?: "enPassant" | "castling" | "promotion";
}

interface RelativeMove extends BaseMove {
    x: number;
    y: number;
    group?: number;
}

interface CompleteMove extends BaseMove {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    piece: Piece;
    toPiece?: Piece;
    san: string;
}

export type { RelativeMove as RelativeMove };
export type { CompleteMove as CompleteMove };
