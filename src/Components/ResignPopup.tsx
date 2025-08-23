import Popup from "./ui/Popup";
import GreyButton from "./ui/GreyButton";
import "../styles/ResignPopup.scss";
import playSound from "../utils/playSound";
import { invertColor } from "../utils/helpers";
import GreenButton from "./ui/GreenButton";
import { usePopupStore } from "../services/stores/usePopupStore";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import { useColorToPlay } from "../services/stores/useBoardSelectors";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import { useCustomGameStore } from "../services/stores/useCustomGameStore";

function ResignPopup() {
    const removePopup = usePopupStore((state) => state.removePopup);

    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const colorToPlay = useColorToPlay();
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    const customGame = useCustomGameStore((state) => state.customGame);

    function resign() {
        removePopup();
        if (customGame === "3Players") {
            fetch(`https://chantemuse.fr/api/chess/3players/stopGame.php`, {
                method: "POST",
                body: new URLSearchParams("GET"),
            }).then(() => {
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
        <Popup className="resign-popup" onClick={removePopup}>
            <div className="resign-popup-text">
                Are you sure you want to resign?
            </div>
            <div className="resign-popup-buttons">
                <div className="rows-split">
                    <GreyButton text="Cancel" onClick={removePopup} />
                    <GreenButton text="Yes" onClick={resign} />
                </div>
            </div>
        </Popup>
    );
}

export default ResignPopup;
