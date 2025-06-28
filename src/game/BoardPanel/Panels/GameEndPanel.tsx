import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import useGameContext from "../../../hooks/useGameContext";
import CapturedPieces from "../../Components/CapturedPieces";
import PanelMovesList from "../Components/PanelMovesList";
import "../../../styles/GameEndPanel.scss";
import GreyButton from "../../Components/GreyButton";

function GameEndPanel() {
    const { movesHistory, actualMove, setActualMove, setGameStatus } =
        useGameContext();
    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    function undoChessBoard() {
        setActualMove((prev) => prev - 1);
    }

    function redoChessBoard() {
        setActualMove((prev) => prev + 1);
    }

    function newGame() {
        resetChessBoard();
        setGameStatus("modeSelection");
    }

    return (
        <>
            <div className="board-panel-content">
                <CapturedPieces />
                <PanelMovesList />
                <div className="game-control">
                    <GreyButton
                        onClick={undoChessBoard}
                        disabled={actualMove <= 0}
                    >
                        <svg
                            viewBox="0 0 32 32"
                            height="28.75"
                            width="28.75"
                            aria-hidden="true"
                            data-glyph="arrow-chevron-left"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                d="m10.7 18.433 6.733 6.734c1.167 1.166 1.634 1.166 2.8 0 1.167-1.167 1.167-1.634 0-2.834L13.9 16l6.333-6.367c1.167-1.166 1.167-1.633 0-2.8-1.166-1.166-1.633-1.166-2.833 0l-6.7 6.734c-1.533 1.5-1.533 3.366 0 4.866"
                            ></path>
                        </svg>
                    </GreyButton>
                    <GreyButton
                        onClick={redoChessBoard}
                        disabled={actualMove >= movesHistory.length - 1}
                    >
                        <svg
                            viewBox="0 0 32 32"
                            height="28.75"
                            width="28.75"
                            aria-hidden="true"
                            data-glyph="arrow-chevron-right"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                xmlns="http://www.w3.org/2000/svg"
                                d="m21.3 13.567-6.733-6.734c-1.167-1.166-1.634-1.166-2.8 0C10.6 8 10.6 8.467 11.767 9.667L18.1 16l-6.333 6.367c-1.167 1.166-1.167 1.633 0 2.8 1.166 1.166 1.633 1.166 2.833 0l6.7-6.734c1.533-1.5 1.533-3.366 0-4.866"
                            ></path>
                        </svg>
                    </GreyButton>
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
