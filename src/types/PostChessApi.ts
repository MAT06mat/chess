import { PieceSymbol } from "./Piece";

type PostChessApiData = {
    fen: string;
    variants?: number; // max: 5, default: 1,
    depth?: number; // max: 18, default: 12,
    maxThinkingTime?: number; // max: 100, default: 50 (ms),
    searchmoves?: string; // evaluate specific moves only, ex. 'd2d4 e2e4',
};

type PostChessApiResponse = {
    text: string;
    eval: number;
    move: string;
    fen: string;
    depth: number;
    winChance: number;
    continuationArr: string[];
    continuation: {
        from: string;
        to: string;
        fromNumeric: number[];
        toNumeric: number[];
    }[];
    mate: null | number;
    centipawns: number;

    san: string;
    lan: string;
    turn: string;
    color: string;
    piece: PieceSymbol;
    flags: string;
    promotion: false | PieceSymbol;
    captured: false | PieceSymbol;
    isCapture: boolean;
    isCastling: boolean;
    isPromotion: boolean;

    from: string;
    to: string;
    fromNumeric: number[];
    toNumeric: number[];

    taskId: string;
    time?: number;
    type: string;
};

export type { PostChessApiData, PostChessApiResponse };
