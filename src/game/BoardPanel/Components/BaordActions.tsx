import ArrowChevronEnd from "../../../assets/svg/ArrowChevronEnd";
import ArrowChevronLeft from "../../../assets/svg/ArrowChevronLeft";
import ArrowChevronRight from "../../../assets/svg/ArrowChevronRight";
import ArrowChevronStart from "../../../assets/svg/ArrowChevronStart";
import ArrowSpinReset from "../../../assets/svg/ArrowSpinReset";
import ArrowTriangleSwooshLeft from "../../../assets/svg/ArrowTriangleSwooshLeft";
import GameFlagStraight from "../../../assets/svg/GameFlagStraight";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import playSound from "../../../utils/playSound";
import GreyButton from "../../Components/ui/GreyButton";
import ResignPopup from "../../Components/ResignPopup";
import { useGameStateStore } from "../../../services/stores/useGameStateStore";
import { usePopupStore } from "../../../services/stores/usePopupStore";
import { useBoardStore } from "../../../services/stores/useBoardStore";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";

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
    const addPopup = usePopupStore((state) => state.addPopup);
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const goToFirstMove = useBoardStore((state) => state.goToFirstMove);
    const goToLastMove = useBoardStore((state) => state.goToLastMove);
    const currentMoveUndo = useBoardStore((state) => state.currentMoveUndo);
    const currentMoveRedo = useBoardStore((state) => state.currentMoveRedo);
    const undoMove = useBoardStore((state) => state.undoMove);
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    const resetChessBoard = useCallbackResetChessBoard();

    function resignGame() {
        addPopup(<ResignPopup />);
    }

    function resetGame() {
        resetChessBoard();
        playSound("game-end");
        setGameStatus("modeSelection");
    }

    function completeUndoChessBoard() {
        const lastMove = history[history.length - 1].lastMove;
        let removeNumber = 1;
        if (
            lastMove?.piece.color === opponentColor &&
            history.length !== 2 &&
            gameStatus === "playingVsBot"
        ) {
            removeNumber = 2;
        }
        undoMove(removeNumber);
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
                <GreyButton onClick={goToFirstMove} disabled={currentMove <= 0}>
                    <ArrowChevronStart />
                </GreyButton>
            ) : null}
            {undo ? (
                <GreyButton
                    onClick={currentMoveUndo}
                    disabled={currentMove <= 0}
                >
                    <ArrowChevronLeft />
                </GreyButton>
            ) : null}
            {redo ? (
                <GreyButton
                    onClick={currentMoveRedo}
                    disabled={currentMove >= history.length - 1}
                >
                    <ArrowChevronRight />
                </GreyButton>
            ) : null}
            {end ? (
                <GreyButton
                    onClick={goToLastMove}
                    disabled={currentMove >= history.length - 1}
                >
                    <ArrowChevronEnd />
                </GreyButton>
            ) : null}
        </>
    );
}

export default BoardActions;
