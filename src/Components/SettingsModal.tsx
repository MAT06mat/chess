import { useModalStore } from "../services/stores/useModalStore";
import Modal from "./ui/Modal";
import "../styles/SettingsModal.scss";
import TextBox from "./ui/TextBox";
import { useCurrentBoard } from "../services/stores/useBoardSelectors";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import SwicthButton from "./ui/SwicthButton";

function SettingsModal() {
    const removeModal = useModalStore((state) => state.removeModal);
    const theme = useSettingsStore((state) => state.theme);
    const setTheme = useSettingsStore((state) => state.setTheme);

    const currentBoard = useCurrentBoard();
    const fen = currentBoard.fen;

    function handleSwitchTheme() {
        setTheme(theme == "light" ? "neo" : "light");
    }

    return (
        <Modal className="settings-modal" onClick={removeModal}>
            <h2>Settings</h2>
            <ul>
                <li>
                    <span>Custom Pieces Style</span>
                    <SwicthButton
                        active={theme == "light"}
                        onClick={handleSwitchTheme}
                    />
                </li>
            </ul>
            <div className="separator"></div>
            <h2>FEN</h2>
            <TextBox text={fen} nowrap allowCopy />
        </Modal>
    );
}

export default SettingsModal;
