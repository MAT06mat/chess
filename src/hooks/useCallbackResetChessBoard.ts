import { useCallback } from "react";
import { useBoardStore } from "../stores/useBoardStore";
import { useGameStateStore } from "../stores/useGameStateStore";

function useCallbackResetChessBoard() {
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const setGameReview = useGameStateStore((state) => state.setGameReview);

    const resetHistory = useBoardStore((state) => state.resetHistory);

    return useCallback(() => {
        setGameReview(false);
        resetHistory();
        setColorWinner(null);
    }, [setGameReview, resetHistory, setColorWinner]);
}

export default useCallbackResetChessBoard;
