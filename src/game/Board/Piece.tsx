import useGameContext from "../../hooks/useGameContext";
import { Piece as PieceType } from "../../types";

interface PieceProps {
    piece: PieceType;
    onPieceClick: (piece: PieceType) => void;
}

function Piece({ piece, onPieceClick }: PieceProps) {
    const { invertedColor } = useGameContext();

    const style = invertedColor
        ? {
              left: `${(7 - piece.x) * 12.5}%`,
              bottom: `${(7 - piece.y) * 12.5}%`,
          }
        : {
              left: `${piece.x * 12.5}%`,
              bottom: `${piece.y * 12.5}%`,
          };

    function handleClick() {
        onPieceClick(piece);
    }

    return (
        <div
            className={"piece in-board " + piece.color + piece.type}
            style={style}
            onClick={handleClick}
        />
    );
}

export default Piece;
