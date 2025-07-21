import Board from "./Board/Board";
import BoardPanel from "./BoardPanel/BoardPanel";
import Title from "./Components/Title";
import PlaySound from "./Components/PlaySound";
import PopupProvider from "./Components/PopupProvider";
import "../styles/Game.scss";

function Game() {
    return (
        <div className="game">
            <PopupProvider />
            <PlaySound />
            <Title onlyMobileScreen />
            <Board />
            <BoardPanel />
        </div>
    );
}

export default Game;
