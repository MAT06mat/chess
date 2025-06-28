import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import useGameContext from "../../../hooks/useGameContext";
import CapturedPieces from "../../Components/CapturedPieces";
import PanelMovesList from "../Components/PanelMovesList";
import GreyButton from "../../Components/GreyButton";
import BoardActions from "../Components/BaordActions";

function GameEndPanel() {
    const { setGameStatus } = useGameContext();
    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    function newGame() {
        resetChessBoard();
        setGameStatus("modeSelection");
    }

    return (
        <>
            <div className="board-panel-content">
                <CapturedPieces />
                <PanelMovesList />
                <div className="game-controlers">
                    <BoardActions undo redo />
                </div>
            </div>
            <div className="board-panel-footer">
                <div className="rows-split">
                    <GreyButton text="New game" light onClick={newGame} />
                    <GreyButton text="Rematch" light onClick={startGame} />
                </div>
            </div>
        </>
    );
}

export default GameEndPanel;
