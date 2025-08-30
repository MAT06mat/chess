import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { ColorWinner, GameStatus } from "../../types";
import playSound from "../../utils/playSound";
import { isPlayingStatus } from "../../utils/helpers";

type GameState = {
    gameStatus: GameStatus;
    gameReview: boolean;
    colorWinner: ColorWinner;
    reason: string;
    title: string;
    isSandBox: boolean;
};

type GameActions = {
    setGameStatus: (gameStatus: GameStatus) => void;
    setGameReview: (gameReview: boolean) => void;
    setColorWinner: (colorWinner: ColorWinner, reason?: string) => void;
};

export const useGameStateStore = create(
    persist(
        combine<GameState, GameActions>(
            {
                gameStatus: "modeSelection",
                gameReview: false,
                colorWinner: null,
                reason: "",
                title: "Chess modeSelection",
                isSandBox: false,
            },
            (set) => {
                return {
                    setGameStatus: (gameStatus: GameStatus) => {
                        set((state) => {
                            const title = "Chess " + gameStatus;
                            const isSandBox = gameStatus === "playingSandBox";

                            if (
                                !isPlayingStatus(gameStatus) &&
                                isPlayingStatus(state.gameStatus)
                            ) {
                                playSound("game-end");
                            } else if (
                                isPlayingStatus(gameStatus) &&
                                !isPlayingStatus(state.gameStatus)
                            ) {
                                playSound("game-start");
                            }

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
                    setColorWinner: (colorWinner: ColorWinner, reason = "") => {
                        set(() => ({
                            colorWinner,
                            reason: reason,
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
