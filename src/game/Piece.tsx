import piece from "../types/piece";

interface PieceProps {
    piece: piece;
    onPieceClick: (piece: piece) => void;
}

function Piece({ piece, onPieceClick }: PieceProps) {
    const style = {
        left: `${piece.x * 12.5}%`,
        bottom: `${piece.y * 12.5}%`,
    };

    function handleClick() {
        onPieceClick(piece);
    }

    return (
        <div
            className={"piece " + piece.type}
            style={style}
            onClick={handleClick}
        />
    );
}

export default Piece;
export type { piece };
