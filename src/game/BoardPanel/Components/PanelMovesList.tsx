import useGameContext from "../../../hooks/useGameContext";
import { useRef } from "react";
import "../../../styles/PanelMovesList.scss";
import getChessNotation from "../../../utils/getChessNotation";
import BoardActions from "./BaordActions";

function createPairMoves(arr: string[]) {
    const result: { m: string | null; i: number }[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
        const first = arr[i];
        const second = arr[i + 1] !== undefined ? arr[i + 1] : null;
        result.push([
            { m: first, i: i + 1 },
            { m: second, i: i + 2 },
        ]);
    }
    return result;
}

function PanelMovesList() {
    const { setActualMove, actualMove, movesHistory, colorWinner } =
        useGameContext();

    const chessMoves = movesHistory.map((moveHistory) => {
        if (!moveHistory.lastMove) return "";
        return getChessNotation(moveHistory.lastMove);
    });

    chessMoves.shift();

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

    const movesList = createPairMoves(chessMoves);

    return (
        <div className="panel-moves-list-wrapper">
            <div className="panel-moves-list" ref={panelMovesListRef}>
                {movesList.map((moves, index) => {
                    const lightRow = index % 2 === 1 ? " light-row" : "";
                    const selected1 =
                        moves[0].i === actualMove ? " selected" : "";
                    const selected2 =
                        moves[1].i === actualMove ? " selected" : "";
                    return (
                        <div key={index} className={"move-list-row" + lightRow}>
                            <div className="number">{index + 1}.</div>
                            <div
                                ref={selectedMoveRef}
                                className={"move-notation" + selected1}
                                onClick={() => setActualMove(moves[0].i)}
                            >
                                {moves[0].m}
                            </div>
                            {moves[1].m ? (
                                <div
                                    ref={selectedMoveRef}
                                    className={"move-notation" + selected2}
                                    onClick={() => setActualMove(moves[1].i)}
                                >
                                    {moves[1].m}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
                {colorWinner ? (
                    <div className="game-winner">
                        {colorWinner === "w"
                            ? "1-0"
                            : colorWinner === "b"
                            ? "0-1"
                            : "½–½"}
                    </div>
                ) : null}
            </div>
            <div className="game-controlers computer-screen">
                <BoardActions undo redo />
            </div>
        </div>
    );
}

export default PanelMovesList;
