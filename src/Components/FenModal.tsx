import Modal from "./ui/Modal";
import GreenButton from "./ui/GreenButton";
import { useModalStore } from "../services/stores/useModalStore";
import { useCurrentBoard } from "../services/stores/useBoardSelectors";
import "../styles/FenModal.scss";
import Copy from "../assets/svg/Copy";

function FenModal() {
    const removeModal = useModalStore((state) => state.removeModal);

    const currentBoard = useCurrentBoard();
    const fen = currentBoard.fen;

    function copy() {
        navigator.clipboard.writeText(fen);
        removeModal();
    }

    return (
        <Modal className="fen-modal" onClick={removeModal}>
            <div className="fen-modal-text">FEN :</div>
            <div className="fen-modal-code">{fen}</div>
            <GreenButton className="fen-modal-button" onClick={copy}>
                <Copy />
            </GreenButton>
        </Modal>
    );
}

export default FenModal;
