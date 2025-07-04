import ArrowChevronEnd from "../../../assets/svg/ArrowChevronEnd";
import ArrowChevronLeft from "../../../assets/svg/ArrowChevronLeft";
import ArrowChevronRight from "../../../assets/svg/ArrowChevronRight";
import ArrowChevronStart from "../../../assets/svg/ArrowChevronStart";
import ArrowSpinReset from "../../../assets/svg/ArrowSpinReset";
import ArrowTriangleSwooshLeft from "../../../assets/svg/ArrowTriangleSwooshLeft";
import GameFlagStraight from "../../../assets/svg/GameFlagStraight";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useGameContext from "../../../hooks/useGameContext";
import playSound from "../../../utils/playSound";
import GreyButton from "../../Components/GreyButton";

interface Props {
    resign?: boolean;
    cancel?: boolean;
    reset?: boolean;
    start?: boolean;
    undo?: boolean;
    redo?: boolean;
    end?: boolean;
}

function BoardActions({
    resign,
    cancel,
    reset,
    start,
    undo,
    redo,
    end,
}: Props) {
    const {
        movesHistory,
        setMovesHistory,
        actualMove,
        setActualMove,
        invertedColor,
        gameStatus,
        setGameStatus,
        setResignPopupVisible,
    } = useGameContext();

    const resetChessBoard = useCallbackResetChessBoard();

    function resignGame() {
        setResignPopupVisible(true);
    }

    function resetGame() {
        resetChessBoard();
        playSound("game-end");
        setGameStatus("modeSelection");
    }

    function completeUndoChessBoard() {
        const lastMove = movesHistory[movesHistory.length - 1].lastMove;
        let removeNumber = 1;
        if (
            lastMove?.piece.type[0] === (invertedColor ? "w" : "b") &&
            movesHistory.length !== 2 &&
            gameStatus === "playingVsBot"
        ) {
            removeNumber = 2;
        }
        if (movesHistory.length <= removeNumber) {
            return;
        }
        const newHistory = movesHistory.slice(0, -removeNumber);
        if (actualMove >= movesHistory.length - removeNumber) {
            setActualMove(movesHistory.length - removeNumber - 1);
        }
        setMovesHistory(newHistory);
    }

    function goToStartChessBoard() {
        setActualMove(0);
    }

    function undoChessBoard() {
        setActualMove((prev) => prev - 1);
    }

    function redoChessBoard() {
        setActualMove((prev) => prev + 1);
    }

    function goToEndChessBoard() {
        setActualMove(movesHistory.length - 1);
    }

    return (
        <>
            {resign ? (
                <GreyButton onClick={resignGame}>
                    <GameFlagStraight />
                </GreyButton>
            ) : null}
            {cancel ? (
                <GreyButton onClick={completeUndoChessBoard}>
                    <ArrowTriangleSwooshLeft />
                </GreyButton>
            ) : null}
            {reset ? (
                <GreyButton onClick={resetGame}>
                    <ArrowSpinReset />
                </GreyButton>
            ) : null}
            {start ? (
                <GreyButton
                    onClick={goToStartChessBoard}
                    disabled={actualMove <= 0}
                >
                    <ArrowChevronStart />
                </GreyButton>
            ) : null}
            {undo ? (
                <GreyButton onClick={undoChessBoard} disabled={actualMove <= 0}>
                    <ArrowChevronLeft />
                </GreyButton>
            ) : null}
            {redo ? (
                <GreyButton
                    onClick={redoChessBoard}
                    disabled={actualMove >= movesHistory.length - 1}
                >
                    <ArrowChevronRight />
                </GreyButton>
            ) : null}
            {end ? (
                <GreyButton
                    onClick={goToEndChessBoard}
                    disabled={actualMove >= movesHistory.length - 1}
                >
                    <ArrowChevronEnd />
                </GreyButton>
            ) : null}
        </>
    );
}

export default BoardActions;
