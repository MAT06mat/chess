import Board from "./Board";
import BoardPanel from "./BoardPanel";
import { GameContext } from "../context/GameContext";
import { usePersistedState } from "../hooks/usePersistedSate";
import boardPosition from "../types/boardPosition";
import { useEffect, useState } from "react";
import playSound from "../utils/playSound";
import Title from "./Title";
import "../styles/Game.scss";
import getDefaultBoard from "../utils/getDefaultBoard";

function Game() {
    const [movesHistory, setMovesHistory] = usePersistedState<boardPosition[]>(
        "movesHistory",
        [getDefaultBoard()]
    );
    const [actualMove, setActualMove] = usePersistedState("actualMove", 0);
    const [colorWinner, setColorWinner] = useState<"w" | "b" | "s" | null>(
        null
    );
    const [invertedColor, setInvertedColor] = usePersistedState(
        "invertedColor",
        false
    );
    const title = "Chess Sandbox";

    const colorToPlay = movesHistory[actualMove].lastMove
        ? movesHistory[actualMove].lastMove.piece.type[0] === "w"
            ? "b"
            : "w"
        : "w";

    useEffect(() => {
        const lastMove = movesHistory[actualMove].lastMove;
        if (lastMove?.check) {
            playSound("move-check");
        } else if (lastMove?.capture) {
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
                colorWinner,
                setColorWinner,
                invertedColor,
                setInvertedColor,
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
