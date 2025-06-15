import React, { createContext } from "react";
import boardPosition from "../types/boardPosition";

type GameContextType = {
    movesHistory: boardPosition[];
    setMovesHistory: React.Dispatch<React.SetStateAction<boardPosition[]>>;
    actualMove: number;
    setActualMove: React.Dispatch<React.SetStateAction<number>>;
    title: string;
    colorToPlay: "w" | "b";
    colorWinner: "w" | "b" | "s" | null;
    setColorWinner: React.Dispatch<
        React.SetStateAction<"w" | "b" | "s" | null>
    >;
    invertedColor: boolean;
};

export const GameContext = createContext<GameContextType | null>(null);
