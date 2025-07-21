import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import CapturedPiecesContainer from "../../Components/CapturedPieces";
import PanelMovesList from "../Components/PanelMovesList";
import GreyButton from "../../Components/GreyButton";
import GreenButton from "../../Components/GreenButton";
import { useBoardStore } from "../../../stores/useBoardStore";
import { useGameStateStore } from "../../../stores/useGameStateStore";

function GameEndPanel() {
    const gameReview = useGameStateStore((state) => state.gameReview);
    const setGameReview = useGameStateStore((state) => state.setGameReview);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const goToFirstMove = useBoardStore((state) => state.goToFirstMove);
    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    function newGame() {
        resetChessBoard();
        setGameStatus("modeSelection");
    }

    function runGameReview() {
        setGameReview(true);
        goToFirstMove();
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
