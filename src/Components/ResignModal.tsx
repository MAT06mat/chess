import Modal from "./ui/Modal";
import GreyButton from "./ui/GreyButton";
import "../styles/ResignModal.scss";
import playSound from "../utils/playSound";
import { invertColor } from "../utils/helpers";
import GreenButton from "./ui/GreenButton";
import { useModalStore } from "../services/stores/useModalStore";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import { useColorToPlay } from "../services/stores/useBoardSelectors";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import { useCustomGameStore } from "../services/stores/useCustomGameStore";
import useFetchCallback from "../services/custom-game/3players/useFetch";

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
                playSound("game-end");
            });
            return;
        }
        if (gameStatus === "playingVsBot") {
            setColorWinner(opponentColor);
        } else {
            setColorWinner(invertColor(colorToPlay));
        }
        setGameStatus("gameEnd");
        playSound("game-end");
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
