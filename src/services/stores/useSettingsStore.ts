import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { PlaySide, PlayVs } from "../../types";
import random from "random";

type SettingsState = {
    invertedColor: boolean;
    playSide: PlaySide;
    playVs: PlayVs;
    playerColor: "w" | "b";
    opponentColor: "w" | "b";
};

type SettingsActions = {
    updateInvertedColor: () => void;
    setPlaySide: (playSide: PlaySide) => void;
    setPlayVs: (playVs: PlayVs) => void;
};

export const useSettingsStore = create(
    persist(
        combine<SettingsState, SettingsActions>(
            {
                invertedColor: false,
                playSide: "white",
                playVs: "friend",
                playerColor: "w",
                opponentColor: "b",
            },
            (set) => {
                return {
                    setPlaySide: (playSide: PlaySide) => {
                        set(() => ({
                            playSide,
                        }));
                    },
                    setPlayVs: (playVs: PlayVs) => {
                        set(() => ({
                            playVs,
                        }));
                    },
                    updateInvertedColor: () => {
                        set((state) => {
                            let invertedColor = state.playSide === "black";
                            if (state.playSide === "random") {
                                invertedColor = random.boolean();
                            }
                            const playerColor = invertedColor ? "b" : "w";
                            const opponentColor = invertedColor ? "w" : "b";
                            return {
                                invertedColor,
                                playerColor,
                                opponentColor,
                            };
                        });
                    },
                };
            }
        ),
        {
            name: "game-settings-storage",
        }
    )
);
