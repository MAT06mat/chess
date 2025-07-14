import Popup from "./Popup";
import GreyButton from "./GreyButton";
import "../../styles/ResignPopup.scss";
import useGameContext from "../../hooks/useGameContext";
import playSound from "../../utils/playSound";
import invertColor from "../../utils/invertColor";
import GreenButton from "./GreenButton";

function ResignPopup() {
    const {
        setColorWinner,
        colorToPlay,
        opponentColor,
        gameStatus,
        setGameStatus,
        resignPopupVisible,
        setResignPopupVisible,
    } = useGameContext();

    function resign() {
        setResignPopupVisible(false);
        if (gameStatus === "playingVsBot") {
            setColorWinner(opponentColor);
        } else {
            setColorWinner(invertColor(colorToPlay));
        }
        setGameStatus("gameEnd");
        playSound("game-end");
    }

    function cancel() {
        setResignPopupVisible(false);
    }

    return (
        <Popup
            className="resign-popup"
            visible={resignPopupVisible}
            onClick={cancel}
        >
            <div className="resign-popup-text">
                Are you sure you want to resign?
            </div>
            <div className="resign-popup-buttons">
                <div className="rows-split">
                    <GreyButton text="Cancel" onClick={cancel} />
                    <GreenButton text="Yes" onClick={resign} />
                </div>
            </div>
        </Popup>
    );
}

export default ResignPopup;
