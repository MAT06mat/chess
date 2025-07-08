type PieceSymbol = "k" | "q" | "b" | "n" | "r" | "p";

type Piece = {
    type: PieceSymbol;
    color: "w" | "b";
    x: number;
    y: number;
    id: number;
    hasMoved?: boolean;
};

export type { Piece, PieceSymbol };
