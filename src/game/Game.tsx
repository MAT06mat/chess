import Board from "./Board/Board";
import BoardPanel from "./BoardPanel/BoardPanel";
import Title from "./Components/Title";
import ResignPopup from "./Components/ResignPopup";
import GameProvider from "../context/GameProvider";
import PlaySound from "./Components/PlaySound";
import "../styles/Game.scss";

function Game() {
    return (
        <GameProvider>
            <div className="game">
                <ResignPopup />
                <PlaySound />
                <Title onlyMobileScreen />
                <Board />
                <BoardPanel />
            </div>
        </GameProvider>
    );
}

export default Game;
