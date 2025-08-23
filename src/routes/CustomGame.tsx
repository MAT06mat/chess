import { useNavigate } from "react-router";
import Card from "../Components/Card";
import { useCustomGameStore } from "../services/stores/useCustomGameStore";
import "../styles/CustomGame.scss";
import { useGameStateStore } from "../services/stores/useGameStateStore";
import useCallbackResetChessBoard from "../hooks/useCallbackResetChessBoard";

function CustomGame() {
    const setCustomGame = useCustomGameStore((state) => state.setCustomGame);
    const setCustomGameData = useCustomGameStore(
        (state) => state.setCustomGameData
    );
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
