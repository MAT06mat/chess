import { useCallback } from "react";
import useGameContext from "./useGameContext";
import playSound from "../utils/playSound";
import useCallbackResetChessBoard from "./useCallbackResetChessBoard";
import random from "random";

function useCallbackStartGame() {
    const { playSide, setInvertedColor, setGameStatus, playVs } =
        useGameContext();

    const resetChessBoard = useCallbackResetChessBoard();

    return useCallback(() => {
        if (playSide === "random") {
            setInvertedColor(random.boolean());
        }
        resetChessBoard();
        if (playVs === "friend") {
            setGameStatus("playingVsFriend");
        } else if (playVs === "bot") {
            setGameStatus("playingVsBot");
        } else {
            setGameStatus("playingSandBox");
        }
        playSound("game-start");
    }, [playSide, playVs, setInvertedColor, resetChessBoard, setGameStatus]);
}

export default useCallbackStartGame;
