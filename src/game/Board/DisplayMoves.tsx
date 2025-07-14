import { Piece } from "../../types";
import BoardInfo from "./BoardInfo";

interface Props {
    selectedPiece: Piece | null;
    displayMoves: { x: number; y: number; capture?: boolean }[];
    boardRef: React.RefObject<HTMLDivElement>;
}

function DisplayMoves({ selectedPiece, displayMoves, boardRef }: Props) {
    if (!selectedPiece) return null;

    const moves = displayMoves.map((move, index) => {
        return (
            <BoardInfo
                className={move.capture ? "capture-hint" : "hint"}
                borderWidth={
                    boardRef.current?.clientWidth
                        ? boardRef.current?.clientWidth * 0.011 + "px"
                        : undefined
                }
                key={index}
                x={move.x + selectedPiece.x}
                y={move.y + selectedPiece.y}
            />
        );
    });

    return moves;
}

export default DisplayMoves;
