import Board from "./Board";
import BoardPanel from "./BoardPanel";
import "../styles/Game.scss";
import { useState } from "react";
import { GameContext } from "./GameContext";
import defaultBoard, { boardPosition } from "../assets/defaultBoard";

function Game() {
    const [movesHistory, setMovesHistory] = useState<boardPosition[]>([
        { pieces: structuredClone(defaultBoard), lastMove: null },
    ]);
    const [actualMove, setActualMove] = useState(0);

    return (
        <GameContext.Provider
            value={{ movesHistory, setMovesHistory, actualMove, setActualMove }}
        >
            <div className="game">
                <Board />
                <BoardPanel />
            </div>
        </GameContext.Provider>
    );
}

export default Game;
