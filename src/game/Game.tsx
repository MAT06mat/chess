import Board from "./Board";
import BoardPanel from "./BoardPanel";
import "../styles/Game.scss";
import { GameContext } from "./GameContext";
import defaultBoard, { boardPosition } from "../assets/defaultBoard";
import { usePersistedState } from "../assets/usePersistedSate";

function Game() {
    const [movesHistory, setMovesHistory] = usePersistedState<boardPosition[]>(
        "movesHistory",
        [{ pieces: structuredClone(defaultBoard), lastMove: null }]
    );
    const [actualMove, setActualMove] = usePersistedState("actualMove", 0);

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
