import Board from "./Board";
import BoardPanel from "./BoardPanel";
import { GameContext } from "../context/GameContext";
import { usePersistedState } from "../hooks/usePersistedSate";
import boardPosition from "../types/boardPosition";
import defaultBoard from "../assets/defaultBoard";
import { useEffect } from "react";
import playSound from "../utils/playSound";
import Title from "./Title";
import "../styles/Game.scss";

function Game() {
    const [movesHistory, setMovesHistory] = usePersistedState<boardPosition[]>(
        "movesHistory",
        [{ pieces: structuredClone(defaultBoard), lastMove: null }]
    );
    const [actualMove, setActualMove] = usePersistedState("actualMove", 0);
    const title = "Chess Sandbox";

    const lastBoard = movesHistory[movesHistory.length - 1];
    const colorToPlay = lastBoard.lastMove
        ? lastBoard.lastMove.piece.type[0] === "w"
            ? "b"
            : "w"
        : "w";

    useEffect(() => {
        const lastMove = movesHistory[actualMove].lastMove;

        if (lastMove?.type) {
            playSound("capture");
        } else if (lastMove?.special === "promotion") {
            playSound("promote");
        } else if (lastMove?.special === "castling") {
            playSound("castle");
        } else {
            playSound("move-self");
        }
    }, [movesHistory, actualMove]);

    return (
        <GameContext.Provider
            value={{
                movesHistory,
                setMovesHistory,
                actualMove,
                setActualMove,
                title,
                colorToPlay,
            }}
        >
            <div className="game">
                <Title onlyMobileScreen />
                <Board />
                <BoardPanel />
            </div>
        </GameContext.Provider>
    );
}

export default Game;
