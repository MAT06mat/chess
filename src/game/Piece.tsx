interface piece {
    type: string;
    x: number;
    y: number;
    id: number;
    hasMoved?: boolean;
}

interface PieceProps {
    piece: piece;
    setSelectedPiece: React.Dispatch<React.SetStateAction<piece | null>>;
}

function Piece({ piece, setSelectedPiece }: PieceProps) {
    const style = {
        left: `${piece.x * 12.5}%`,
        bottom: `${piece.y * 12.5}%`,
    };

    function handleClick() {
        setSelectedPiece(piece);
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
