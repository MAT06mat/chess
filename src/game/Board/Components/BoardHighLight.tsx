import { ReactNode, useMemo } from "react";
import { Piece } from "../../../types";
import BoardInfo from "./BoardInfo";
import {
    useLastMove,
    useShapes,
} from "../../../services/stores/useBoardSelectors";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";
import { useGameStateStore } from "../../../services/stores/useGameStateStore";
import { squareToCoords } from "../../../utils/formatting";

interface Props {
    selectedPiece: Piece | null;
}

function BoardHighLight({ selectedPiece }: Props) {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const lastMove = useLastMove();
    const shapes = useShapes();
    const invertedColor = useSettingsStore((state) => state.invertedColor);

    return useMemo(() => {
        const redSquares = shapes.filter((shape) => shape.from === shape.to);
        const infos: ReactNode[] = [];
        const coords: string[] = [];

        function addHighLight(x: number, y: number, className: string) {
            const coord = `${x},${y}`;
            if (!coords.includes(coord)) {
                coords.push(coord);
                infos.push(
                    <BoardInfo
                        className={className}
                        invertedColor={invertedColor}
                        x={x}
                        y={y}
                        key={coord}
                    />
                );
            }
        }

        redSquares.forEach((shape) => {
            const coord = squareToCoords(shape.to);
            addHighLight(coord.x, coord.y, "shape");
        });

        if (lastMove && gameStatus !== "playingSandBox") {
            addHighLight(lastMove.toX, lastMove.toY, "highlight");
            addHighLight(lastMove.fromX, lastMove.fromY, "highlight");
        }

        if (selectedPiece) {
            addHighLight(selectedPiece.x, selectedPiece.y, "highlight");
        }

        return infos;
    }, [lastMove, shapes, gameStatus, selectedPiece, invertedColor]);
}

export default BoardHighLight;
