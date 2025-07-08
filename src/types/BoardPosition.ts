import { CompleteMove } from "./Move";
import { Piece } from "./Piece";
import { PostChessApiResponse } from "./PostChessApi";

interface BoardPosition {
    pieces: Piece[];
    lastMove: CompleteMove | null;
    fen: string;
    chessApiData?: PostChessApiResponse;
}

export type { BoardPosition };
