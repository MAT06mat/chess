import Board from "./Board";
import BoardPanel from "./BoardPanel";
import "../styles/Game.scss";

function Game() {
    return (
        <div className="game">
            <Board />
            <BoardPanel />
        </div>
    );
}

export default Game;
