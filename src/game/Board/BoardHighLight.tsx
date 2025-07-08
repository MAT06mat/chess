import { CompleteMove, Piece } from "../../types";
import BoardInfo from "./BoardInfo";

interface Props {
    selectedPiece: Piece | null;
    lastMove: CompleteMove | null;
}

function BoardHighLight({ selectedPiece, lastMove }: Props) {
    let lastMovePos = null;
    let selectedPiecePos = null;

    if (lastMove) {
        lastMovePos = (
            <>
                <BoardInfo
                    className="highlight"
                    x={lastMove.toX}
                    y={lastMove.toY}
                />
                <BoardInfo
                    className="highlight"
                    x={lastMove.fromX}
                    y={lastMove.fromY}
                />
            </>
        );
    }

    if (
        selectedPiece &&
        !(
            lastMove?.fromX === selectedPiece.x &&
            lastMove?.fromY === selectedPiece.y
        ) &&
        !(
            lastMove?.toX === selectedPiece.x &&
            lastMove?.toY === selectedPiece.y
        )
    ) {
        selectedPiecePos = (
            <BoardInfo
                className="highlight"
                x={selectedPiece.x}
                y={selectedPiece.y}
            />
        );
    }

    return (
        <>
            {lastMovePos}
            {selectedPiecePos}
        </>
    );
}

export default BoardHighLight;
