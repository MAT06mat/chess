import { useModalStore } from "../services/stores/useModalStore";

export const ModalProvider = () => useModalStore((state) => state.currentModal);
