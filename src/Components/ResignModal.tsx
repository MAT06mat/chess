import Modal from "./ui/Modal";
import GreyButton from "./ui/GreyButton";
import { invertColor } from "../utils/helpers";
import GreenButton from "./ui/GreenButton";
import { useModalStore } from "../services/stores/useModalStore";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import { useColorToPlay } from "../services/stores/useBoardSelectors";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import { useCustomGameStore } from "../services/stores/useCustomGameStore";
import useFetchCallback from "../services/custom-game/3players/useFetch";
import "../styles/ResignModal.scss";

function ResignModal() {
    const removeModal = useModalStore((state) => state.removeModal);

    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const colorToPlay = useColorToPlay();
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    const customGame = useCustomGameStore((state) => state.customGame);
    const fetchCallback = useFetchCallback();

    function resign() {
        removeModal();
        if (customGame === "3Players") {
            fetchCallback({ stopGame: true })?.then(() => {
                setGameStatus("modeSelection");
            });
            return;
        }
        if (gameStatus === "playingVsBot") {
            setColorWinner(opponentColor, "by Resign");
        } else {
            setColorWinner(invertColor(colorToPlay), "by Resign");
        }
        setGameStatus("gameEnd");
    }

    return (
        <Modal className="resign-modal" onClick={removeModal}>
            <div className="resign-modal-text">
                Are you sure you want to resign?
            </div>
            <div className="resign-modal-buttons">
                <div className="rows-split">
                    <GreyButton text="Cancel" onClick={removeModal} />
                    <GreenButton text="Yes" onClick={resign} />
                </div>
            </div>
        </Modal>
    );
}

export default ResignModal;
