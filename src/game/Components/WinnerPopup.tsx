import { useState } from "react";
import Popup from "./Popup";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/WinnerPopup.scss";
import useCallbackResetChessBoard from "../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../hooks/useCallbackStartGame";

function WinnerPopup() {
    const { colorWinner, setGameStatus } = useGameContext();
    const [visible, setVisible] = useState(true);
    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    if (colorWinner === null && !visible) {
        setVisible(true);
    }

    function handleClick() {
        setVisible(false);
    }

    function rematch() {
        startGame();
        setVisible(false);
    }

    function newGame() {
        resetChessBoard();
        setGameStatus("modeSelection");
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
                <button className="green-button" onClick={rematch}>
                    Rematch
                </button>
                <div className="rows-split">
                    <button
                        className="grey-button light-grey"
                        onClick={newGame}
                    >
                        New game
                    </button>
                    <button
                        className="grey-button light-grey"
                        onClick={gameReview}
                    >
                        Game Review
                    </button>
                </div>
            </div>
        </Popup>
    );
}

export default WinnerPopup;
