import { completeMove } from "./move";
import piece from "./piece";
import { PostChessApiResponse } from "./PostChessApi";

interface boardPosition {
    pieces: piece[];
    lastMove: completeMove | null;
    fen: string;
    chessApiData?: PostChessApiResponse;
}

export default boardPosition;
