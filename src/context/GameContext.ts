import React, { createContext } from "react";
import {
    BoardPosition,
    ColorWinner,
    GameStatus,
    PiecesScores,
    PlaySide,
    PlayVs,
} from "../types";
import { ArrowProps } from "../game/Board/Arrow";

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>;

type GameContextType = {
    movesHistory: BoardPosition[];
    setMovesHistory: Dispatch<BoardPosition[]>;
    actualMove: number;
    setActualMove: Dispatch<number>;
    title: string;
    colorToPlay: "w" | "b";
    colorWinner: ColorWinner;
    setColorWinner: Dispatch<ColorWinner>;
    invertedColor: boolean;
    playerColor: "w" | "b";
    opponentColor: "w" | "b";
    setInvertedColor: Dispatch<boolean>;
    gameStatus: GameStatus;
    setGameStatus: Dispatch<GameStatus>;
    playSide: PlaySide;
    setPlaySide: Dispatch<PlaySide>;
    playVs: PlayVs;
    setPlayVs: Dispatch<PlayVs>;
    piecesScores: PiecesScores;
    resignPopupVisible: boolean;
    setResignPopupVisible: Dispatch<boolean>;
    gameReview: boolean;
    setGameReview: Dispatch<boolean>;
    actualBoard: BoardPosition;
    lastMove: BoardPosition["lastMove"];
    pieces: BoardPosition["pieces"];
    shapes: ArrowProps[];
};

export type { GameContextType };
export const GameContext = createContext<GameContextType | null>(null);
