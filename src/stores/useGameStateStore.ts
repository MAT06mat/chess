import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { ColorWinner, GameStatus } from "../types";

type GameState = {
    gameStatus: GameStatus;
    gameReview: boolean;
    colorWinner: ColorWinner;
    title: string;
    isSandBox: boolean;
};

type GameActions = {
    setGameStatus: (gameStatus: GameStatus) => void;
    setGameReview: (gameReview: boolean) => void;
    setColorWinner: (colorWinner: ColorWinner) => void;
};

export const useGameStateStore = create(
    persist(
        combine<GameState, GameActions>(
            {
                gameStatus: "modeSelection",
                gameReview: false,
                colorWinner: null,
                title: "Chess modeSelection",
                isSandBox: false,
            },
            (set) => {
                return {
                    setGameStatus: (gameStatus: GameStatus) => {
                        set(() => {
                            const title = "Chess " + gameStatus;
                            const isSandBox = gameStatus === "playingSandBox";

                            return {
                                gameStatus,
                                title,
                                isSandBox,
                            };
                        });
                    },
                    setGameReview: (gameReview: boolean) => {
                        set(() => ({
                            gameReview,
                        }));
                    },
                    setColorWinner: (colorWinner: ColorWinner) => {
                        set(() => ({
                            colorWinner,
                        }));
                    },
                };
            }
        ),
        {
            name: "game-state-storage",
        }
    )
);
