import { useCallback } from "react";
import getDefaultBoard from "../utils/getDefaultBoard";
import useGameContext from "./useGameContext";

function useCallbackResetChessBoard() {
    const { setMovesHistory, setActualMove, setColorWinner } = useGameContext();

    return useCallback(() => {
        setMovesHistory([getDefaultBoard()]);
        setActualMove(0);
        setColorWinner(null);
    }, [setMovesHistory, setActualMove, setColorWinner]);
}

export default useCallbackResetChessBoard;
