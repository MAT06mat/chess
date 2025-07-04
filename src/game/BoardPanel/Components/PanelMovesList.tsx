import useGameContext from "../../../hooks/useGameContext";
import { useEffect, useRef } from "react";
import "../../../styles/PanelMovesList.scss";
import BoardActions from "./BaordActions";

interface customMove {
    move: string | null;
    index: number;
    className: string;
    selected: boolean;
}

function createCustomMove(
    move: string | null,
    index: number,
    actualMove: number
) {
    const selected = index === actualMove;
    const className = selected ? "move-notation selected" : "move-notation";
    return { move, index, className, selected };
}

function createPairMoves(arr: string[], actualMove: number) {
    const result: customMove[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
        const first = arr[i];
        const second = arr[i + 1] !== undefined ? arr[i + 1] : null;
        result.push([
            createCustomMove(first, i + 1, actualMove),
            createCustomMove(second, i + 2, actualMove),
        ]);
    }
    return result;
}

function PanelMovesList() {
    const {
        setActualMove,
        actualMove,
        movesHistory,
        colorWinner,
        gameStatus,
        gameReview,
    } = useGameContext();

    const isGameEnd = gameStatus === "gameEnd";

    const chessMoves = movesHistory.map((moveHistory) => {
        if (!moveHistory.lastMove) return "";
        return moveHistory.lastMove.san;
    });

    chessMoves.shift();

    const panelMovesListRef = useRef<HTMLDivElement>(null);
    const selectedMoveRef = useRef<HTMLDivElement>(null);
    const gameWinnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let divElement = null;
        if (gameWinnerRef.current && actualMove === movesHistory.length - 1) {
            divElement = gameWinnerRef.current;
        } else {
            divElement = selectedMoveRef.current;
        }
        divElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [actualMove, movesHistory]);

    const movesList = createPairMoves(chessMoves, actualMove);

    return (
        <div className="panel-moves-list-wrapper">
            <div className="game-controler mobile-screen">
                <BoardActions undo />
            </div>
            <div className="panel-moves-list" ref={panelMovesListRef}>
                {movesList.map((moves, index) => {
                    const lightRow = index % 2 === 1 ? " light-row" : "";
                    return (
                        <div key={index} className={"move-list-row" + lightRow}>
                            <div className="number">{index + 1}.</div>
                            <div
                                ref={moves[0].selected ? selectedMoveRef : null}
                                className={moves[0].className}
                                onClick={() => setActualMove(moves[0].index)}
                            >
                                {moves[0].move}
                            </div>
                            {moves[1].move ? (
                                <div
                                    ref={
                                        moves[1].selected
                                            ? selectedMoveRef
                                            : null
                                    }
                                    className={moves[1].className}
                                    onClick={() =>
                                        setActualMove(moves[1].index)
                                    }
                                >
                                    {moves[1].move}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
                {isGameEnd ? (
                    <div className="game-winner" ref={gameWinnerRef}>
                        {colorWinner === "w"
                            ? "1-0"
                            : colorWinner === "b"
                            ? "0-1"
                            : "½–½"}
                    </div>
                ) : null}
            </div>
            <div className="game-controler mobile-screen">
                <BoardActions redo />
            </div>
            <div
                className={
                    "game-controlers computer-screen" +
                    (gameReview ? " game-review" : "")
                }
            >
                <BoardActions start={isGameEnd} undo redo end={isGameEnd} />
            </div>
        </div>
    );
}

export default PanelMovesList;
