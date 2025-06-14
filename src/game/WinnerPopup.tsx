import { useState } from "react";
import Popup from "./Popup";
import useGameContext from "../hooks/useGameContext";
import "../styles/WinnerPopup.scss";
import useDefaultBoard from "../hooks/useDefaultBoard";

function WinnerPopup() {
    const { colorWinner, setMovesHistory, setActualMove, setColorWinner } =
        useGameContext();
    const defaultBoard = useDefaultBoard();
    const [visible, setVisible] = useState(true);

    if (colorWinner === null && !visible) {
        setVisible(true);
    }

    function handleClick() {
        setVisible(false);
    }

    function rematch() {
        setMovesHistory([{ pieces: defaultBoard, lastMove: null }]);
        setActualMove(0);
        setColorWinner(null);
        setVisible(false);
    }

    function gameReview() {
        setVisible(false);
    }

    let title = "Draw";
    if (colorWinner === "w") {
        title = "White Won !";
    } else if (colorWinner === "b") {
        title = "Black Won !";
    } else if (colorWinner === "s") {
        title = "Stalemate";
    }

    return (
        <Popup
            className="winner-popup"
            visible={colorWinner !== null && visible}
            onClick={handleClick}
        >
            <div className="winner-popup-title">{title}</div>
            <div className="winner-popup-buttons">
                <button className="grey-button light-grey" onClick={rematch}>
                    Rematch
                </button>
                <button className="grey-button light-grey" onClick={gameReview}>
                    Game Review
                </button>
            </div>
        </Popup>
    );
}

export default WinnerPopup;
