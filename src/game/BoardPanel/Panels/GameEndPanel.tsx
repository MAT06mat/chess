import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import useGameContext from "../../../hooks/useGameContext";
import CapturedPiecesContainer from "../../Components/CapturedPieces";
import PanelMovesList from "../Components/PanelMovesList";
import GreyButton from "../../Components/GreyButton";
import GreenButton from "../../Components/GreenButton";

function GameEndPanel() {
    const { setGameStatus, setActualMove, gameReview, setGameReview } =
        useGameContext();
    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    function newGame() {
        resetChessBoard();
        setGameStatus("modeSelection");
    }

    function runGameReview() {
        setGameReview(true);
        setActualMove(0);
    }

    return (
        <>
            <div className="board-panel-content">
                <CapturedPiecesContainer />
                <PanelMovesList />
            </div>
            <div className="board-panel-footer">
                {gameReview ? null : (
                    <GreenButton text="Game review" onClick={runGameReview} />
                )}
                <div className="rows-split">
                    <GreyButton text="New game" light onClick={newGame} />
                    <GreyButton text="Rematch" light onClick={startGame} />
                </div>
            </div>
        </>
    );
}

export default GameEndPanel;
