import React, { useMemo, useState } from "react";
import { GameContext, GameContextType } from "./GameContext";
import { usePersistedState } from "../hooks/usePersistedSate";
import getDefaultBoard from "../utils/getDefaultBoard";
import invertColor from "../utils/invertColor";
import getPiecesScores from "../utils/getPiecesScores";
import {
    ColorWinner,
    GameStatus,
    PlaySide,
    PlayVs,
    BoardPosition,
} from "../types";

type Props = {
    children: React.ReactNode;
};

function GameProvider({ children }: Props) {
    const [movesHistory, setMovesHistory] = usePersistedState<BoardPosition[]>(
        "movesHistory",
        [getDefaultBoard()]
    );
    const [actualMove, setActualMove] = usePersistedState("actualMove", 0);
    const [gameStatus, setGameStatus] = usePersistedState<GameStatus>(
        "gameStatus",
        "modeSelection"
    );
    const [gameReview, setGameReview] = usePersistedState<boolean>(
        "gameReview",
        false
    );
    const [colorWinner, setColorWinner] = usePersistedState<ColorWinner>(
        "colorWinner",
        null
    );
    const [invertedColor, setInvertedColor] = usePersistedState(
        "invertedColor",
        false
    );
    const [playSide, setPlaySide] = usePersistedState<PlaySide>(
        "playSide",
        "white"
    );
    const [playVs, setPlayVs] = usePersistedState<PlayVs>("playVs", "friend");
    const [resignPopupVisible, setResignPopupVisible] = useState(false);

    const lastMove = movesHistory[actualMove]?.lastMove;
    const colorToPlay = invertColor(lastMove?.piece.color);
    const piecesScores = getPiecesScores(movesHistory, actualMove);
    const playerColor = invertedColor ? "b" : "w";
    const opponentColor = invertedColor ? "w" : "b";
    const title = "Chess " + gameStatus;

    const gameValues: GameContextType = {
        movesHistory,
        setMovesHistory,
        actualMove,
        setActualMove,
        title,
        colorToPlay,
        colorWinner,
        setColorWinner,
        invertedColor,
        playerColor,
        opponentColor,
        setInvertedColor,
        gameStatus,
        setGameStatus,
        playSide,
        setPlaySide,
        playVs,
        setPlayVs,
        piecesScores,
        resignPopupVisible,
        setResignPopupVisible,
        gameReview,
        setGameReview,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => gameValues, Object.values(gameValues));

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
}

export default GameProvider;
