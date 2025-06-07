import { useContext, useRef } from "react";
import "../styles/BoardPanel.scss";
import { GameContext } from "./GameContext";
import defaultBoard from "../assets/DefaultBoard";

interface pNI {
    p: string;
    n: string;
    b: string;
    q: string;
    k: string;
}

const pN = {
    p: "",
    r: "R",
    n: "N",
    b: "B",
    q: "Q",
    k: "K",
};

const cN = "abcdefgh";

function BoardPanel() {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error(
            "BoardPanel must be used within a GameContext.Provider"
        );
    }
    const { movesHistory, setMovesHistory, actualMove, setActualMove } = game;

    const panelContentRef = useRef<HTMLDivElement>(null);

    function resetChessBoard() {
        setMovesHistory([
            { pieces: structuredClone(defaultBoard), lastMove: null },
        ]);
        setActualMove(0);
    }

    function undoChessBoard() {
        console.log(actualMove - 1);
        setActualMove((prev) => prev - 1);
    }

    function redoChessBoard() {
        console.log(actualMove + 1);
        setActualMove((prev) => prev + 1);
    }

    const chessMoves = movesHistory.map((moveHistory) => {
        if (!moveHistory.lastMove) return "";

        const p = moveHistory.lastMove?.piece.type[1];
        const x = moveHistory.lastMove?.toX;
        const y = moveHistory.lastMove?.toY;

        return pN[p as keyof pNI] + cN[x ? x : 0] + (y + 1);
    });

    return (
        <div className="board-panel">
            <div className="board-panel-header">
                <div className="title">Sandbox</div>
            </div>
            <div className="board-panel-content" ref={panelContentRef}>
                {chessMoves.map((m, i) => {
                    setTimeout(() =>
                        panelContentRef.current?.scrollTo({
                            left: 0,
                            top: panelContentRef.current.scrollHeight,
                            behavior: "smooth",
                        })
                    );
                    return <div key={i}>{m}</div>;
                })}
            </div>
            <div className="board-panel-footer">
                <button
                    onClick={resetChessBoard}
                    disabled={movesHistory.length === 1}
                >
                    <svg
                        viewBox="0 0 32 32"
                        height="28.75"
                        width="28.75"
                        aria-hidden="true"
                        data-glyph="arrow-spin-undo"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="M16 26.467c6.067 0 10.5-4.867 10.5-10.467 0-5.933-4.8-10.5-10.5-10.5-2.7 0-5.367 1.033-7.433 3.067L7.1 10.033l2.133 2.134L10.7 10.7A7.5 7.5 0 0 1 16 8.5c4.133 0 7.5 3.367 7.5 7.5s-3.367 7.5-7.5 7.5c-2.533 0-4.5-1.167-6-2.967-.633-.866-1.2-.966-2.1-.333-.867.667-.967 1.2-.333 2.1C9.6 24.867 12.4 26.467 16 26.467M4.533 16.133l6.3-.833c.9-.133 1.034-.6.4-1.233L5.3 8.133c-.633-.633-1.1-.5-1.233.434l-.834 6.266c-.133 1.1.2 1.434 1.3 1.3"
                        ></path>
                    </svg>
                </button>
                <button onClick={undoChessBoard} disabled={actualMove <= 0}>
                    <svg
                        viewBox="0 0 32 32"
                        height="28.75"
                        width="28.75"
                        aria-hidden="true"
                        data-glyph="arrow-chevron-left"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="m10.7 18.433 6.733 6.734c1.167 1.166 1.634 1.166 2.8 0 1.167-1.167 1.167-1.634 0-2.834L13.9 16l6.333-6.367c1.167-1.166 1.167-1.633 0-2.8-1.166-1.166-1.633-1.166-2.833 0l-6.7 6.734c-1.533 1.5-1.533 3.366 0 4.866"
                        ></path>
                    </svg>
                </button>
                <button
                    onClick={redoChessBoard}
                    disabled={actualMove >= movesHistory.length - 1}
                >
                    <svg
                        viewBox="0 0 32 32"
                        height="28.75"
                        width="28.75"
                        aria-hidden="true"
                        data-glyph="arrow-chevron-right"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="m21.3 13.567-6.733-6.734c-1.167-1.166-1.634-1.166-2.8 0C10.6 8 10.6 8.467 11.767 9.667L18.1 16l-6.333 6.367c-1.167 1.166-1.167 1.633 0 2.8 1.166 1.166 1.633 1.166 2.833 0l6.7-6.734c1.533-1.5 1.533-3.366 0-4.866"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default BoardPanel;
