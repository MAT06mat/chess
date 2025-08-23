import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import "../../../styles/ModeSelectionPanel.scss";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import GreenButton from "../../../Components/ui/GreenButton";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";
import { useCustomGameStore } from "../../../services/stores/useCustomGameStore";
import { useCallback, useEffect, useState } from "react";
import { useGameStateStore } from "../../../services/stores/useGameStateStore";
import GreyButton from "../../../Components/ui/GreyButton";
import ArrowSpinReset from "../../../assets/svg/ArrowSpinReset";

type ColorIconProps = {
    color: "white1" | "white2" | "black";
    count?: number;
    onClick: () => void;
};

const ColorIcon = ({ color, count = 0, onClick }: ColorIconProps) => {
    const customGameData = useCustomGameStore((state) => state.customGameData);
    const baseClass = color.startsWith("white") ? "white" : "black";

    function isSelectedSide(color: string) {
        return color === customGameData?.playSide ? " selected" : "";
    }

    return (
        <div
            className={`color-icon ${baseClass}${isSelectedSide(color)}`}
            onClick={onClick}
        >
            <span className="players-number">{count || ""}</span>
        </div>
    );
};

function ThreePlayersPanel() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setPlayVs = useSettingsStore((state) => state.setPlayVs);
    const setPlaySide = useSettingsStore((state) => state.setPlaySide);
    const updateInvertedColor = useSettingsStore(
        (state) => state.updateInvertedColor
    );
    const customGameData = useCustomGameStore((state) => state.customGameData);
    const setCustomGameData = useCustomGameStore(
        (state) => state.setCustomGameData
    );

    const resetChessBoard = useCallbackResetChessBoard();

    const startGame = useCallbackStartGame();

    const processServerConnection = useCallback(
        (data: {
            userName: string | undefined;
            blackPlayer1: string[];
            whitePlayer1: string[];
            whitePlayer2: string[];
            gameStarted: boolean;
            history: string;
        }) => {
            if (data.userName === undefined) {
                console.error(
                    "User name is undefined in server connection data.",
                    data
                );
                return;
            }

            const playSide = data.blackPlayer1.includes(data.userName)
                ? "black"
                : data.whitePlayer1.includes(data.userName)
                ? "white1"
                : data.whitePlayer2.includes(data.userName)
                ? "white2"
                : "";

            setCustomGameData({
                userName: data.userName,
                playSide,
                serverConnection: data,
            });

            setPlaySide(playSide === "black" ? playSide : "white");
            updateInvertedColor();
            resetChessBoard();

            if (
                data.gameStarted &&
                gameStatus === "modeSelection" &&
                playSide
            ) {
                startGame();
            }
        },
        [
            resetChessBoard,
            setCustomGameData,
            setPlaySide,
            updateInvertedColor,
            gameStatus,
            startGame,
        ]
    );

    function colorIconClick(color: "white1" | "white2" | "black" | "") {
        if (!customGameData?.userName) return;

        const params = new URLSearchParams();
        params.append("userName", customGameData.userName);

        const selected = customGameData.playSide === color ? "" : color;
        const colorMap: Record<"white1" | "white2" | "black", string> = {
            white1: "whitePlayer1",
            white2: "whitePlayer2",
            black: "blackPlayer1",
        };

        if (selected) {
            params.append(colorMap[selected], "on");
        }

        fetch("https://chantemuse.fr/api/chess/3players/userConnection.php", {
            method: "POST",
            body: params,
        })
            .then((res) => res.json())
            .then(processServerConnection)
            .catch((err) => console.error("Fetch error:", err));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!customGameData?.userName) return;

            setPlayVs("friend");

            fetch(
                `https://chantemuse.fr/api/chess/3players/getConnection.php?t=${Date.now()}`,
                {
                    method: "POST",
                }
            )
                .then((res) => res.json())
                .then((res) => ({
                    ...res,
                    userName: customGameData.userName,
                }))
                .then(processServerConnection)
                .catch((err) => console.error("Fetch error:", err));
        }, 1000);

        return () => clearInterval(interval);
    }, [processServerConnection, customGameData, setPlayVs]);

    const [buttonLoading, setButtonLoading] = useState(false);

    return (
        <>
            <div className="board-panel-content">
                <div className="user-name-input">
                    <span>User name :</span>
                    <input
                        type="text"
                        name="userName"
                        placeholder="User name"
                        disabled={!!customGameData?.playSide}
                        value={customGameData?.userName}
                        onChange={(e) =>
                            setCustomGameData({
                                ...(customGameData
                                    ? customGameData
                                    : { playSide: "" }),
                                userName: e.target.value.toString() ?? "",
                            })
                        }
                    />
                </div>
                <div className="side-selection">
                    <ColorIcon
                        color="white1"
                        count={
                            customGameData?.serverConnection?.whitePlayer1
                                .length
                        }
                        onClick={() => colorIconClick("white1")}
                    />
                    <ColorIcon
                        color="white2"
                        count={
                            customGameData?.serverConnection?.whitePlayer2
                                .length
                        }
                        onClick={() => colorIconClick("white2")}
                    />
                    <ColorIcon
                        color="black"
                        count={
                            customGameData?.serverConnection?.blackPlayer1
                                .length
                        }
                        onClick={() => colorIconClick("black")}
                    />
                </div>
                <div className="side-selection">
                    <GreyButton
                        light
                        disabled={customGameData?.serverConnection?.gameStarted}
                        onClick={() => {
                            if (!customGameData?.userName) return;

                            const params = new URLSearchParams();
                            params.append("userName", customGameData.userName);
                            params.append("resetPlayers", "on");

                            fetch(
                                "https://chantemuse.fr/api/chess/3players/userConnection.php",
                                {
                                    method: "POST",
                                    body: params,
                                }
                            )
                                .then((res) => res.json())
                                .then(processServerConnection)
                                .catch((err) =>
                                    console.error("Fetch error:", err)
                                );
                        }}
                    >
                        <ArrowSpinReset />
                    </GreyButton>
                </div>
            </div>
            <div className="board-panel-footer">
                <GreenButton
                    text="Play"
                    disabled={
                        buttonLoading ||
                        !customGameData?.serverConnection ||
                        !customGameData.userName ||
                        !customGameData.playSide ||
                        customGameData.serverConnection.whitePlayer1.length !==
                            1 ||
                        customGameData.serverConnection.whitePlayer2.length !==
                            1 ||
                        customGameData.serverConnection.blackPlayer1.length !==
                            1 ||
                        customGameData.serverConnection.gameStarted
                    }
                    large
                    onClick={() => {
                        setButtonLoading(true);
                        fetch(
                            "https://chantemuse.fr/api/chess/3players/launchGame.php",
                            {
                                method: "POST",
                            }
                        )
                            .then((res) => res.json())
                            .then(() => setButtonLoading(false))
                            .catch((err) => {
                                setButtonLoading(false);
                                console.error("Fetch error:", err);
                            });
                    }}
                />
            </div>
        </>
    );
}

export default ThreePlayersPanel;
