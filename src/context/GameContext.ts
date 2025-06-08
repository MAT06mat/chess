import { createContext } from "react";
import boardPosition from "../types/boardPosition";

type GameContextType = {
    movesHistory: boardPosition[];
    setMovesHistory: React.Dispatch<React.SetStateAction<boardPosition[]>>;
    actualMove: number;
    setActualMove: React.Dispatch<React.SetStateAction<number>>;
};

export const GameContext = createContext<GameContextType | null>(null);
