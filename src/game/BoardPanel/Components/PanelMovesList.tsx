import useGameContext from "../../../hooks/useGameContext";
import { useEffect, useRef } from "react";
import "../../../styles/PanelMovesList.scss";
import BoardActions from "./BaordActions";

type refObj = React.RefObject<HTMLDivElement>;

interface customMove {
    move: string | null;
    index: number;
    className: string;
    ref: refObj | null;
}

function createCustomMove(
    move: string | null,
    index: number,
    actualMove: number,
    ref: refObj
) {
    const selected = index === actualMove;
    const className = selected ? "move-notation selected" : "move-notation";
    const newRef = selected || (index === 1 && actualMove === 0) ? ref : null;
    return { move, index, className, ref: newRef };
}

function createPairMoves(arr: string[], actualMove: number, ref: refObj) {
    const result: customMove[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
        const first = arr[i];
        const second = arr[i + 1] !== undefined ? arr[i + 1] : null;
        result.push([
            createCustomMove(first, i + 1, actualMove, ref),
            createCustomMove(second, i + 2, actualMove, ref),
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

    const selectedMoveRef = useRef<HTMLDivElement>(null);
    const gameWinnerRef = useRef<HTMLDivElement>(null);

    const movesList = createPairMoves(chessMoves, actualMove, selectedMoveRef);

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

    return (
        <div className="panel-moves-list-wrapper">
            <div className="game-controler mobile-screen">
                <BoardActions undo />
            </div>
            <div className="panel-moves-list">
                {movesList.map((moves, index) => {
                    const lightRow = index % 2 === 1 ? " light-row" : "";
                    return (
                        <div key={index} className={"move-list-row" + lightRow}>
                            <div className="number">{index + 1}.</div>
                            <div
                                ref={moves[0].ref}
                                className={moves[0].className}
                                onClick={() => setActualMove(moves[0].index)}
                            >
                                {moves[0].move}
                            </div>
                            {moves[1].move ? (
                                <div
                                    ref={moves[1].ref}
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
