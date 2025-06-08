import useGameContext from "../hooks/useGameContext";
import { useRef } from "react";
import "../styles/PanelMovesList.scss";

interface Props {
    chessMoves: string[];
}

function PanelMovesList({ chessMoves }: Props) {
    const { setActualMove, actualMove, movesHistory } = useGameContext();

    const panelMovesListRef = useRef<HTMLDivElement>(null);
    const selectedMoveRef = useRef<HTMLDivElement>(null);

    if (actualMove === movesHistory.length - 1) {
        setTimeout(() =>
            panelMovesListRef.current?.scrollTo({
                left: 0,
                top: panelMovesListRef.current.scrollHeight,
                behavior: "smooth",
            })
        );
    }

    return (
        <div className="panel-moves-list" ref={panelMovesListRef}>
            {chessMoves.map((move, index) => {
                const lightRow = index % 2 === 1 ? " light-row" : "";
                const selected = index + 1 === actualMove ? " selected" : "";
                return (
                    <div key={index} className={"move-list-row" + lightRow}>
                        <div className="number">{index + 1}.</div>
                        <div
                            ref={selectedMoveRef}
                            className={"move-notation" + selected}
                            onClick={() => setActualMove(index + 1)}
                        >
                            {move}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PanelMovesList;
