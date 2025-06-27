import Bot from "../../assets/svg/Bot";
import SandBox from "../../assets/svg/SandBox";
import Friends from "../../assets/svg/Friends";
import useCallbackResetChessBoard from "../../hooks/useCallbackResetChessBoard";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/ModeSelectionPanel.scss";
import { playSide } from "../../types";
import useCallbackStartGame from "../../hooks/useCallbackStartGame";

function ModeSelectionPanel() {
    const { setInvertedColor, playSide, setPlaySide, playVs, setPlayVs } =
        useGameContext();

    const resetChessBoard = useCallbackResetChessBoard();

    const startGame = useCallbackStartGame();

    function colorIconClick(color: playSide) {
        setPlaySide(color);
        setInvertedColor(color === "black");
        resetChessBoard();
    }

    function isSelectedSide(color: string) {
        return color === playSide ? " selected" : "";
    }

    function isSelectedVs(opponent: string) {
        return opponent === playVs ? " selected" : "";
    }

    return (
        <>
            <div className="board-panel-content">
                <div className="play-vs-selection">
                    <div
                        className={
                            "play-vs-button grey-button" +
                            isSelectedVs("friend")
                        }
                        onClick={() => setPlayVs("friend")}
                    >
                        <Friends />
                        <span>Play a friend</span>
                    </div>
                    <div
                        className={
                            "play-vs-button grey-button" + isSelectedVs("bot")
                        }
                        onClick={() => setPlayVs("bot")}
                    >
                        <Bot />
                        <span>Play a bot</span>
                    </div>
                    <div
                        className={
                            "play-vs-button grey-button" +
                            isSelectedVs("sandBox")
                        }
                        onClick={() => setPlayVs("sandBox")}
                    >
                        <SandBox />
                        <span>SandBox</span>
                    </div>
                </div>
                <div className="side-selection">
                    <div
                        className={"color-icon white" + isSelectedSide("white")}
                        onClick={() => colorIconClick("white")}
                    />
                    <div
                        className={
                            "color-icon random" + isSelectedSide("random")
                        }
                        onClick={() => colorIconClick("random")}
                    />
                    <div
                        className={"color-icon black" + isSelectedSide("black")}
                        onClick={() => colorIconClick("black")}
                    />
                </div>
            </div>
            <div className="board-panel-footer">
                <button className="green-button" onClick={startGame}>
                    Play
                </button>
            </div>
        </>
    );
}

export default ModeSelectionPanel;
