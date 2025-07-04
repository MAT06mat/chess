import Board from "./Board/Board";
import BoardPanel from "./BoardPanel/BoardPanel";
import { GameContext } from "../context/GameContext";
import { usePersistedState } from "../hooks/usePersistedSate";
import boardPosition from "../types/boardPosition";
import { useEffect, useState } from "react";
import playSound from "../utils/playSound";
import Title from "./Components/Title";
import "../styles/Game.scss";
import getDefaultBoard from "../utils/getDefaultBoard";
import invertColor from "../utils/invertColor";
import { colorWinner, gameStatus, playSide, playVs } from "../types";
import getPiecesScores from "../utils/getPiecesScores";
import ResignPopup from "./Components/ResignPopup";

function Game() {
    const [movesHistory, setMovesHistory] = usePersistedState<boardPosition[]>(
        "movesHistory",
        [getDefaultBoard()]
    );
    const [actualMove, setActualMove] = usePersistedState("actualMove", 0);
    const [gameStatus, setGameStatus] = usePersistedState<gameStatus>(
        "gameStatus",
        "modeSelection"
    );
    const [gameReview, setGameReview] = usePersistedState<boolean>(
        "gameReview",
        false
    );
    const [colorWinner, setColorWinner] = useState<colorWinner>(null);
    const [invertedColor, setInvertedColor] = usePersistedState(
        "invertedColor",
        false
    );
    const [playSide, setPlaySide] = usePersistedState<playSide>(
        "playSide",
        "white"
    );
    const [playVs, setPlayVs] = usePersistedState<playVs>("playVs", "friend");
    const [resignPopupVisible, setResignPopupVisible] = useState(false);

    const title = "Chess " + gameStatus;
    const lastMove = movesHistory[actualMove].lastMove;
    const colorToPlay = invertColor(lastMove?.piece.type[0]);
    const piecesScores = getPiecesScores(movesHistory, actualMove);

    useEffect(() => {
        if (lastMove?.checkMate) {
            playSound("game-end");
        } else if (lastMove?.check) {
            playSound("move-check");
        } else if (lastMove?.capture) {
            playSound("capture");
        } else if (lastMove?.special === "promotion") {
            playSound("promote");
        } else if (lastMove?.special === "castling") {
            playSound("castle");
        } else if (lastMove) {
            playSound("move-self");
        }
    }, [lastMove]);

    return (
        <GameContext.Provider
            value={{
                movesHistory,
                setMovesHistory,
                actualMove,
                setActualMove,
                title,
                colorToPlay,
                colorWinner,
                setColorWinner,
                invertedColor,
                setInvertedColor,
                gameStatus,
                setGameStatus,
                playSide,
                setPlaySide,
                playVs,
                setPlayVs,
                piecesScores,
                resignPopupVisible,
                setResignPopupVisible,
                gameReview,
                setGameReview,
            }}
        >
            <div className="game">
                <ResignPopup />
                <Title onlyMobileScreen />
                <Board />
                <BoardPanel />
            </div>
        </GameContext.Provider>
    );
}

export default Game;
