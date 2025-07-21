import { useCallback } from "react";
import playSound from "../utils/playSound";
import useCallbackResetChessBoard from "./useCallbackResetChessBoard";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useGameStateStore } from "../stores/useGameStateStore";

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
        playSound("game-start");
    }, [playVs, updateInvertedColor, resetChessBoard, setGameStatus]);
}

export default useCallbackStartGame;
