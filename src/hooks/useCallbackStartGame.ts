import { useCallback } from "react";
import useCallbackResetChessBoard from "./useCallbackResetChessBoard";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import { useGameStateStore } from "../services/stores/useGameStateStore";

function useCallbackStartGame() {
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);
    const playVs = useSettingsStore((state) => state.playVs);
    const updateInvertedColor = useSettingsStore(
        (state) => state.updateInvertedColor
    );

    const resetChessBoard = useCallbackResetChessBoard();

    return useCallback(() => {
        updateInvertedColor();
        resetChessBoard();
        if (playVs === "friend") {
            setGameStatus("playingVsFriend");
        } else if (playVs === "bot") {
            setGameStatus("playingVsBot");
        } else {
            setGameStatus("playingSandBox");
        }
    }, [playVs, updateInvertedColor, resetChessBoard, setGameStatus]);
}

export default useCallbackStartGame;
