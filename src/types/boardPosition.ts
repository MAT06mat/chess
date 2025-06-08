import { completeMove } from "./move";
import piece from "./piece";

interface boardPosition {
    pieces: piece[];
    lastMove: completeMove | null;
}

export default boardPosition;
