import { createContext } from "react";
import boardPosition from "../types/boardPosition";

type GameContextType = {
    movesHistory: boardPosition[];
    setMovesHistory: React.Dispatch<React.SetStateAction<boardPosition[]>>;
    actualMove: number;
    setActualMove: React.Dispatch<React.SetStateAction<number>>;
    title: string;
    colorToPlay: "w" | "b";
};

export const GameContext = createContext<GameContextType | null>(null);
