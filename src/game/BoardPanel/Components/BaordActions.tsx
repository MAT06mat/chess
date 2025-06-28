import ArrowChevronLeft from "../../../assets/svg/ArrowChevronLeft";
import ArrowChevronRight from "../../../assets/svg/ArrowChevronRight";
import ArrowSpinUndo from "../../../assets/svg/ArrowSpinUndo";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useGameContext from "../../../hooks/useGameContext";
import GreyButton from "../../Components/GreyButton";

function BoardActions() {
    const { movesHistory, actualMove, setActualMove, setGameStatus } =
        useGameContext();

    const resetChessBoard = useCallbackResetChessBoard();

    function reset() {
        resetChessBoard();
        setGameStatus("modeSelection");
    }

    function undoChessBoard() {
        setActualMove((prev) => prev - 1);
    }

    function redoChessBoard() {
        setActualMove((prev) => prev + 1);
    }
    return (
        <>
            <GreyButton onClick={reset}>
                <ArrowSpinUndo />
            </GreyButton>
            <GreyButton onClick={undoChessBoard} disabled={actualMove <= 0}>
                <ArrowChevronLeft />
            </GreyButton>
            <GreyButton
                onClick={redoChessBoard}
                disabled={actualMove >= movesHistory.length - 1}
            >
                <ArrowChevronRight />
            </GreyButton>
        </>
    );
}

export default BoardActions;
