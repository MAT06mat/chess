import { useModalStore } from "../services/stores/useModalStore";
import Modal from "./ui/Modal";
import "../styles/SettingsModal.scss";
import TextBox from "./ui/TextBox";
import { useCurrentBoard } from "../services/stores/useBoardSelectors";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import SwicthButton from "./ui/SwicthButton";

function SettingsModal() {
    const removeModal = useModalStore((state) => state.removeModal);
    const piecesTheme = useSettingsStore((state) => state.piecesTheme);
    const setPiecesTheme = useSettingsStore((state) => state.setPiecesTheme);
    const boardTheme = useSettingsStore((state) => state.boardTheme);
    const setBoardTheme = useSettingsStore((state) => state.setBoardTheme);

    const currentBoard = useCurrentBoard();
    const fen = currentBoard.fen;

    function handleSwitchPiecesTheme() {
        setPiecesTheme(piecesTheme == "light" ? "neo" : "light");
    }

    function handleSwitchBoardTheme() {
        setBoardTheme(boardTheme == "green" ? "brown" : "green");
    }

    return (
        <Modal className="settings-modal" onClick={removeModal}>
            <h2>Settings</h2>
            <ul>
                <li>
                    <span>Custom Pieces Style</span>
                    <SwicthButton
                        active={piecesTheme == "light"}
                        onClick={handleSwitchPiecesTheme}
                    />
                </li>
                <li>
                    <span>Brown Board Style</span>
                    <SwicthButton
                        active={boardTheme == "brown"}
                        onClick={handleSwitchBoardTheme}
                    />
                </li>
            </ul>
            <h2>FEN</h2>
            <TextBox text={fen} nowrap allowCopy />
        </Modal>
    );
}

export default SettingsModal;
