import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

export type CustomGame = "" | "3Players";

export type CustomGameData =
    | undefined
    | {
          userName: string;
          playSide: string;
          serverConnection?: {
              blackPlayer1: string[];
              whitePlayer1: string[];
              whitePlayer2: string[];
              gameStarted: boolean;
              history: string | null;
          };
      };

export const useCustomGameStore = create(
    persist(
        combine(
            {
                customGame: "" as CustomGame,
                customGameData: {} as CustomGameData,
            },
            (set) => {
                return {
                    setCustomGame: (customGame: CustomGame) => {
                        if (customGame === "3Players") {
                            set(() => ({
                                customGame: "3Players",
                                customGameData: {
                                    userName: "",
                                    playSide: "",
                                },
                            }));
                            return;
                        }
                        set(() => ({ customGame }));
                    },
                    setCustomGameData: (customGameData: CustomGameData) => {
                        set(() => ({ customGameData }));
                    },
                };
            }
        ),
        {
            name: "custom-game-storage",
        }
    )
);
