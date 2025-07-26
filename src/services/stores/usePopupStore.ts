import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { ReactNode } from "react";

type PopupState = { currentPopup: ReactNode; isPopupOpen: boolean };

type PopupActions = {
    addPopup: (popup: ReactNode) => void;
    removePopup: () => void;
};

export const usePopupStore = create(
    persist(
        combine<PopupState, PopupActions>(
            {
                currentPopup: null,
                isPopupOpen: false,
            },
            (set) => {
                return {
                    addPopup: (popup: ReactNode) => {
                        set((state) => {
                            if (state.currentPopup) return {};
                            return {
                                currentPopup: popup,
                                isPopupOpen: true,
                            };
                        });
                    },
                    removePopup: () => {
                        set(() => {
                            return {
                                currentPopup: null,
                                isPopupOpen: false,
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
