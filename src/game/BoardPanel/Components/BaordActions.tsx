import ArrowChevronEnd from "../../../assets/svg/ArrowChevronEnd";
import ArrowChevronLeft from "../../../assets/svg/ArrowChevronLeft";
import ArrowChevronRight from "../../../assets/svg/ArrowChevronRight";
import ArrowChevronStart from "../../../assets/svg/ArrowChevronStart";
import ArrowSpinReset from "../../../assets/svg/ArrowSpinReset";
import ArrowTriangleSwooshLeft from "../../../assets/svg/ArrowTriangleSwooshLeft";
import GameFlagStraight from "../../../assets/svg/GameFlagStraight";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import GreyButton from "../../../Components/ui/GreyButton";
import ResignModal from "../../../Components/ResignModal";
import { useGameStateStore } from "../../../services/stores/useGameStateStore";
import { useModalStore } from "../../../services/stores/useModalStore";
import { useBoardStore } from "../../../services/stores/useBoardStore";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";
import { useCustomGameStore } from "../../../services/stores/useCustomGameStore";

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
    const addModal = useModalStore((state) => state.addModal);
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
    const customGame = useCustomGameStore((state) => state.customGame);

    const resetChessBoard = useCallbackResetChessBoard();

    function resignGame() {
        addModal(<ResignModal />);
    }

    function resetGame() {
        resetChessBoard();
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
                    {!customGame ? "" : <span>Resign</span>}
                    <GameFlagStraight />
                </GreyButton>
            ) : null}
            {cancel && !customGame ? (
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
