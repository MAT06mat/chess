import Popup from "./Popup";
import GreyButton from "./GreyButton";
import "../../styles/ResignPopup.scss";
import playSound from "../../utils/playSound";
import invertColor from "../../utils/invertColor";
import GreenButton from "./GreenButton";
import { useColorToPlay } from "../../stores/useBoardSelectors";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useGameStateStore } from "../../stores/useGameStateStore";
import { usePopupStore } from "../../stores/usePopupStore";

function ResignPopup() {
    const removePopup = usePopupStore((state) => state.removePopup);

    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setColorWinner = useGameStateStore((state) => state.setColorWinner);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const colorToPlay = useColorToPlay();
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    function resign() {
        removePopup();
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
