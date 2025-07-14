import { Piece as PieceType } from "../../types";
import BoardInfo from "./BoardInfo";

interface PieceProps {
    piece: PieceType;
}

function Piece({ piece }: PieceProps) {
    return (
        <BoardInfo
            className={"piece " + piece.color + piece.type}
            x={piece.x}
            y={piece.y}
        />
    );
}

export default Piece;
