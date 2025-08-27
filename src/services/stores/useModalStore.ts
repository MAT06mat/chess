import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { ReactNode } from "react";

type ModalState = { currentModal: ReactNode; isModalOpen: boolean };

type ModalActions = {
    addModal: (modal: ReactNode) => void;
    removeModal: () => void;
};

export const useModalStore = create(
    persist(
        combine<ModalState, ModalActions>(
            {
                currentModal: null,
                isModalOpen: false,
            },
            (set) => {
                return {
                    addModal: (modal: ReactNode) => {
                        set((state) => {
                            if (state.currentModal) return {};
                            return {
                                currentModal: modal,
                                isModalOpen: true,
                            };
                        });
                    },
                    removeModal: () => {
                        set(() => {
                            return {
                                currentModal: null,
                                isModalOpen: false,
                            };
                        });
                    },
                };
            }
        ),
        {
            name: "modal-storage",
        }
    )
);
