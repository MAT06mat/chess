import React, { createContext } from "react";
import boardPosition from "../types/boardPosition";
import {
    colorWinner,
    gameStatus,
    piecesScores,
    playSide,
    playVs,
} from "../types";

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>;

type GameContextType = {
    movesHistory: boardPosition[];
    setMovesHistory: Dispatch<boardPosition[]>;
    actualMove: number;
    setActualMove: Dispatch<number>;
    title: string;
    colorToPlay: "w" | "b";
    colorWinner: colorWinner;
    setColorWinner: Dispatch<colorWinner>;
    invertedColor: boolean;
    setInvertedColor: Dispatch<boolean>;
    gameStatus: gameStatus;
    setGameStatus: Dispatch<gameStatus>;
    playSide: playSide;
    setPlaySide: Dispatch<playSide>;
    playVs: playVs;
    setPlayVs: Dispatch<playVs>;
    piecesScores: piecesScores;
    resignPopupVisible: boolean;
    setResignPopupVisible: Dispatch<boolean>;
    gameReview: boolean;
    setGameReview: Dispatch<boolean>;
};

export type { GameContextType };
export const GameContext = createContext<GameContextType | null>(null);
