import ArrowChevronLeft from "../../../assets/svg/ArrowChevronLeft";
import ArrowChevronRight from "../../../assets/svg/ArrowChevronRight";
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
    undo?: boolean;
    redo?: boolean;
}

function BoardActions({ resign, cancel, reset, undo, redo }: Props) {
    const {
        movesHistory,
        setMovesHistory,
        actualMove,
        setActualMove,
        invertedColor,
        gameStatus,
        setGameStatus,
    } = useGameContext();

    const resetChessBoard = useCallbackResetChessBoard();

    function resignGame() {
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

    function undoChessBoard() {
        setActualMove((prev) => prev - 1);
    }

    function redoChessBoard() {
        setActualMove((prev) => prev + 1);
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
                <GreyButton onClick={resignGame}>
                    <ArrowSpinReset />
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
        </>
    );
}

export default BoardActions;
