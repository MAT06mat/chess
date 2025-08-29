import { useModalStore } from "../services/stores/useModalStore";
import Modal from "./ui/Modal";
import "../styles/SettingsModal.scss";
import TextBox from "./ui/TextBox";
import { useCurrentBoard } from "../services/stores/useBoardSelectors";

function SettingsModal() {
    const removeModal = useModalStore((state) => state.removeModal);

    const currentBoard = useCurrentBoard();
    const fen = currentBoard.fen;

    return (
        <Modal className="settings-modal" onClick={removeModal}>
            <h2>FEN</h2>
            <TextBox text={fen} allowCopy />
        </Modal>
    );
}

export default SettingsModal;
