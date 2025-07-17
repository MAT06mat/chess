import { ReactNode, useEffect, useState } from "react";
import useGameContext from "../../hooks/useGameContext";
import { Piece } from "../../types";
import positionToCoords from "../../utils/positionToCoord";
import BoardInfo from "./BoardInfo";

interface Props {
    selectedPiece: Piece | null;
}

function BoardHighLight({ selectedPiece }: Props) {
    const { lastMove, shapes, gameStatus } = useGameContext();
    const [allBoardInfos, setAllBoardInfos] = useState<ReactNode>(null);

    useEffect(() => {
        const redSquares = shapes.filter((shape) => shape.from === shape.to);

        const boardInfos: ReactNode[] = [];
        const coords: string[] = [];

        function addHighLight(x: number, y: number, className: string) {
            const coord = `${x},${y}`;
            if (!coords.includes(coord)) {
                coords.push(coord);
                boardInfos.push(
                    <BoardInfo className={className} x={x} y={y} key={coord} />
                );
            }
        }

        redSquares.forEach((shape) => {
            const [x, y] = positionToCoords(shape.to);
            addHighLight(x, 7 - y, "shape");
        });

        if (lastMove && gameStatus !== "playingSandBox") {
            addHighLight(lastMove.toX, lastMove.toY, "highlight");
            addHighLight(lastMove.fromX, lastMove.fromY, "highlight");
        }

        if (selectedPiece) {
            addHighLight(selectedPiece.x, selectedPiece.y, "highlight");
        }

        setAllBoardInfos(boardInfos);
    }, [lastMove, shapes, gameStatus, selectedPiece]);

    return allBoardInfos;
}

export default BoardHighLight;
