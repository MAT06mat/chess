import React, { createContext } from "react";
import boardPosition from "../types/boardPosition";
import { colorWinner, gameStatus, playSide, playVs } from "../types";

type GameContextType = {
    movesHistory: boardPosition[];
    setMovesHistory: React.Dispatch<React.SetStateAction<boardPosition[]>>;
    actualMove: number;
    setActualMove: React.Dispatch<React.SetStateAction<number>>;
    title: string;
    colorToPlay: "w" | "b";
    colorWinner: colorWinner;
    setColorWinner: React.Dispatch<React.SetStateAction<colorWinner>>;
    invertedColor: boolean;
    setInvertedColor: React.Dispatch<React.SetStateAction<boolean>>;
    gameStatus: gameStatus;
    setGameStatus: React.Dispatch<React.SetStateAction<gameStatus>>;
    playSide: playSide;
    setPlaySide: React.Dispatch<React.SetStateAction<playSide>>;
    playVs: playVs;
    setPlayVs: React.Dispatch<React.SetStateAction<playVs>>;
};

export const GameContext = createContext<GameContextType | null>(null);
