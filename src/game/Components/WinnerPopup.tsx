import { useState } from "react";
import Popup from "./Popup";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/WinnerPopup.scss";
import useCallbackResetChessBoard from "../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../hooks/useCallbackStartGame";
import GreenButton from "./GreenButton";
import GreyButton from "./GreyButton";

function WinnerPopup() {
    const {
        colorWinner,
        playerColor,
        opponentColor,
        playVs,
        setGameStatus,
        setGameReview,
        setActualMove,
        gameReview,
    } = useGameContext();
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

    function runGameReview() {
        setGameReview(true);
        setActualMove(0);
        setVisible(false);
    }

    let title = "Draw";
    if (colorWinner === "w") {
        title = "White won !";
    } else if (colorWinner === "b") {
        title = "Black won !";
    } else if (colorWinner === "s") {
        title = "Stalemate";
    }

    if (playVs === "bot") {
        if (colorWinner === opponentColor) {
            title = "The bot has won";
        } else if (colorWinner === playerColor) {
            title = "You won !";
        }
    }

    return (
        <Popup
            className="winner-popup"
            visible={colorWinner !== null && visible && !gameReview}
            onClick={handleClick}
        >
            <div className="winner-popup-title">{title}</div>
            <div className="winner-popup-buttons">
                <GreenButton text="Game Review" large onClick={runGameReview} />
                <div className="rows-split">
                    <GreyButton text="New game" light onClick={newGame} />
                    <GreyButton text="Rematch" light onClick={rematch} />
                </div>
            </div>
        </Popup>
    );
}

export default WinnerPopup;
