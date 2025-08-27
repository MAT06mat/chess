import { useNavigate } from "react-router";
import { useCustomGameStore } from "../services/stores/useCustomGameStore";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import { useSettingsStore } from "../services/stores/useSettingsStore";
import useCallbackResetChessBoard from "../hooks/useCallbackResetChessBoard";
import Card from "../Components/ui/Card";
import "../styles/CustomGame.scss";

function CustomGame() {
    const setCustomGame = useCustomGameStore((state) => state.setCustomGame);
    const setCustomGameData = useCustomGameStore(
        (state) => state.setCustomGameData
    );
    const setPlayVs = useSettingsStore((state) => state.setPlayVs);
    const navigate = useNavigate();
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);
    const resetChessBoard = useCallbackResetChessBoard();

    return (
        <div className="custom-game">
            <h1>Custom Game</h1>
            <div className="game-list">
                <Card
                    name="Classic"
                    description="The classic game of chess"
                    icon="https://www.chess.com/bundles/web/images/color-icons/board-4x4-brown.svg"
                    backgroundColor="#e2b664"
                    onClick={() => {
                        setGameStatus("modeSelection");
                        resetChessBoard();
                        setCustomGame("");
                        navigate("/");
                    }}
                />
                <Card
                    name="3 Players"
                    description="A variant of chess with three players"
                    icon="assets/three-p-icon.svg"
                    backgroundColor="#5d9948"
                    onClick={() => {
                        setGameStatus("modeSelection");
                        resetChessBoard();
                        setCustomGame("3Players");
                        setPlayVs("friend");
                        setCustomGameData({
                            userName: "",
                            playSide: "",
                            serverConnection: undefined,
                        });
                        navigate("/");
                    }}
                />
            </div>
        </div>
    );
}

export default CustomGame;
