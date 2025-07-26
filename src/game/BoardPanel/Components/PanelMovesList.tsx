import { useEffect, useRef } from "react";
import "../../../styles/PanelMovesList.scss";
import BoardActions from "./BaordActions";
import { useBoardStore } from "../../../services/stores/useBoardStore";
import { useGameStateStore } from "../../../services/stores/useGameStateStore";

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
    currentMove: number,
    ref: refObj
) {
    const selected = index === currentMove;
    const className = selected ? "move-notation selected" : "move-notation";
    const newRef = selected || (index === 1 && currentMove === 0) ? ref : null;
    return { move, index, className, ref: newRef };
}

function createPairMoves(arr: string[], currentMove: number, ref: refObj) {
    const result: customMove[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
        const first = arr[i];
        const second = arr[i + 1] !== undefined ? arr[i + 1] : null;
        result.push([
            createCustomMove(first, i + 1, currentMove, ref),
            createCustomMove(second, i + 2, currentMove, ref),
        ]);
    }
    return result;
}

function PanelMovesList() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const gameReview = useGameStateStore((state) => state.gameReview);
    const colorWinner = useGameStateStore((state) => state.colorWinner);

    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const setCurrentMove = useBoardStore((state) => state.setCurrentMove);

    const isGameEnd = gameStatus === "gameEnd";

    const chessMoves = history.map((moveHistory) => {
        if (!moveHistory.lastMove) return "";
        return moveHistory.lastMove.san;
    });

    chessMoves.shift();

    const selectedMoveRef = useRef<HTMLDivElement>(null);
    const gameWinnerRef = useRef<HTMLDivElement>(null);

    const movesList = createPairMoves(chessMoves, currentMove, selectedMoveRef);

    useEffect(() => {
        let divElement = null;
        if (gameWinnerRef.current && currentMove === history.length - 1) {
            divElement = gameWinnerRef.current;
        } else {
            divElement = selectedMoveRef.current;
        }
        divElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [history, currentMove]);

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
                                onClick={() => setCurrentMove(moves[0].index)}
                            >
                                {moves[0].move}
                            </div>
                            {moves[1].move ? (
                                <div
                                    ref={moves[1].ref}
                                    className={moves[1].className}
                                    onClick={() =>
                                        setCurrentMove(moves[1].index)
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
