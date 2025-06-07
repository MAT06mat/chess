import Board from "./Board";
import BoardPanel from "./BoardPanel";
import "../styles/Game.scss";
import { useState } from "react";
import defaultBoard, { boardPosition } from "../assets/DefaultBoard";

function Game() {
    const [movesHistory, setMovesHistory] = useState<boardPosition[]>([
        { pieces: defaultBoard, lastMove: null },
    ]);

    return (
        <div className="game">
            <Board
                movesHistory={movesHistory}
                setMovesHistory={setMovesHistory}
            />
            <BoardPanel
                movesHistory={movesHistory}
                setMovesHistory={setMovesHistory}
            />
        </div>
    );
}

export default Game;
