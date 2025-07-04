import Bot from "../../../assets/svg/Bot";
import SandBox from "../../../assets/svg/SandBox";
import Friends from "../../../assets/svg/Friends";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useGameContext from "../../../hooks/useGameContext";
import "../../../styles/ModeSelectionPanel.scss";
import { playSide } from "../../../types";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import GreenButton from "../../Components/GreenButton";
import GreyButton from "../../Components/GreyButton";

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
                    <GreyButton
                        className={"play-vs-button " + isSelectedVs("friend")}
                        onClick={() => setPlayVs("friend")}
                        text="Play a friend"
                    >
                        <Friends />
                    </GreyButton>
                    <GreyButton
                        className={"play-vs-button " + isSelectedVs("bot")}
                        onClick={() => setPlayVs("bot")}
                        text="Play a bot"
                    >
                        <Bot />
                    </GreyButton>
                    <GreyButton
                        className={"play-vs-button " + isSelectedVs("sandBox")}
                        onClick={() => setPlayVs("sandBox")}
                        text="SandBox"
                    >
                        <SandBox />
                    </GreyButton>
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
                <GreenButton text="Play" large onClick={startGame} />
            </div>
        </>
    );
}

export default ModeSelectionPanel;
