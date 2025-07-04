import { useCallback } from "react";
import getDefaultBoard from "../utils/getDefaultBoard";
import useGameContext from "./useGameContext";

function useCallbackResetChessBoard() {
    const { setMovesHistory, setActualMove, setColorWinner, setGameReview } =
        useGameContext();

    return useCallback(() => {
        setMovesHistory([getDefaultBoard()]);
        setGameReview(false);
        setActualMove(0);
        setColorWinner(null);
    }, [setMovesHistory, setActualMove, setColorWinner, setGameReview]);
}

export default useCallbackResetChessBoard;
