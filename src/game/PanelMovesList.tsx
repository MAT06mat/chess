import { useContext, useRef } from "react";
import "../styles/PanelMovesList.scss";
import { GameContext } from "../context/GameContext";

interface Props {
    chessMoves: string[];
}

function PanelMovesList({ chessMoves }: Props) {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error(
            "BoardPanel must be used within a GameContext.Provider"
        );
    }
    const { setActualMove, actualMove } = game;

    const panelMovesListRef = useRef<HTMLDivElement>(null);
    setTimeout(() =>
        panelMovesListRef.current?.scrollTo({
            left: 0,
            top: panelMovesListRef.current.scrollHeight,
            behavior: "smooth",
        })
    );

    return (
        <div className="panel-moves-list" ref={panelMovesListRef}>
            {chessMoves.map((move, index) => {
                const lightRow = index % 2 === 1 ? " light-row" : "";
                const selected = index + 1 === actualMove ? " selected" : "";
                return (
                    <div key={index} className={"move-list-row" + lightRow}>
                        <div className="number">{index + 1}.</div>
                        <div
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
