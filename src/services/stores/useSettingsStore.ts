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

function updateInvertedColor(playSide: PlaySide, noRandom = false) {
    let invertedColor = playSide === "black";
    if (playSide === "random" && !noRandom) {
        invertedColor = random.boolean();
    }
    const playerColor: "w" | "b" = invertedColor ? "b" : "w";
    const opponentColor: "w" | "b" = invertedColor ? "w" : "b";
    return {
        playSide,
        invertedColor,
        playerColor,
        opponentColor,
    };
}

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
                        set(() => updateInvertedColor(playSide, true));
                    },
                    setPlayVs: (playVs: PlayVs) => {
                        set(() => ({
                            playVs,
                        }));
                    },
                    updateInvertedColor: () => {
                        set((state) => updateInvertedColor(state.playSide));
                    },
                };
            }
        ),
        {
            name: "game-settings-storage",
        }
    )
);
