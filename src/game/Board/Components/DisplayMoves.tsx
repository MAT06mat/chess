import { useContext } from "react";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";
import { Piece } from "../../../types";
import BoardInfo from "./BoardInfo";
import { BoardRefContext } from "../../../services/contexts/BoardRefContext";

interface Props {
    selectedPiece: Piece | null;
    displayMoves: { x: number; y: number; capture?: boolean }[];
}

function DisplayMoves({ selectedPiece, displayMoves }: Props) {
    const invertedColor = useSettingsStore((state) => state.invertedColor);
    const boardRef = useContext(BoardRefContext).ref;
    if (!selectedPiece) return null;

    return displayMoves.map((move, index) => {
        return (
            <BoardInfo
                className={move.capture ? "capture-hint" : "hint"}
                borderWidth={
                    boardRef?.current?.clientWidth
                        ? boardRef.current?.clientWidth * 0.011 + "px"
                        : undefined
                }
                invertedColor={invertedColor}
                x={move.x + selectedPiece.x}
                y={move.y + selectedPiece.y}
                key={index}
            />
        );
    });
}

export default DisplayMoves;
