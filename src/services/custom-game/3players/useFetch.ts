import { useCallback } from "react";
import { useCustomGameStore } from "../../stores/useCustomGameStore";
import { useGameStateStore } from "../../stores/useGameStateStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import useCallbackResetChessBoard from "../../../hooks/useCallbackResetChessBoard";
import useCallbackStartGame from "../../../hooks/useCallbackStartGame";
import { useBoardStore } from "../../stores/useBoardStore";
import playSound from "../../../utils/playSound";

const BASE_URL = "https://chantemuse.fr/api/chess/3players";

interface ServerData {
    userName: string | undefined;
    blackPlayer1: string[];
    whitePlayer1: string[];
    whitePlayer2: string[];
    gameStarted: boolean;
    history: string | null;
}

export interface FetchCallbackProps {
    blackPlayer1?: boolean;
    whitePlayer1?: boolean;
    whitePlayer2?: boolean;
    resetPlayers?: boolean;
    launchGame?: boolean;
    stopGame?: boolean;
    history?: string;
    getHistory?: number;
}

export function postData(params: URLSearchParams) {
    return fetch(`${BASE_URL}/index.php?t=${Date.now()}`, {
        method: "POST",
        body: params,
    });
}

function useFetchCallback() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const setGameStatus = useGameStateStore((state) => state.setGameStatus);

    const goToLastMove = useBoardStore((state) => state.goToLastMove);
    const history = useBoardStore((state) => state.history);
    const setHistory = useBoardStore((state) => state.setHistory);

    const setPlaySide = useSettingsStore((state) => state.setPlaySide);
    const updateInvertedColor = useSettingsStore(
        (state) => state.updateInvertedColor
    );

    const setCustomGameData = useCustomGameStore(
        (state) => state.setCustomGameData
    );
    const customGameData = useCustomGameStore((state) => state.customGameData);

    const resetChessBoard = useCallbackResetChessBoard();
    const startGame = useCallbackStartGame();

    const processServerConnection = useCallback(
        (data: ServerData) => {
            const userName = customGameData?.userName;
            if (!userName) {
                console.error("CustomGameData is undefined");
                return;
            }

            const playSide = data.blackPlayer1.includes(userName)
                ? "black"
                : data.whitePlayer1.includes(userName)
                ? "white1"
                : data.whitePlayer2.includes(userName)
                ? "white2"
                : "";

            if (
                customGameData.playSide !== playSide ||
                JSON.stringify(customGameData.serverConnection) !==
                    JSON.stringify(data)
            ) {
                setCustomGameData({
                    userName: userName,
                    playSide,
                    serverConnection: data,
                });
            }

            const newPlaySide = playSide === "black" ? playSide : "white";
            if (customGameData.playSide !== newPlaySide) {
                setPlaySide(newPlaySide);
                updateInvertedColor();
                resetChessBoard();
            }

            if (data.history) {
                const serverHistory = JSON.parse(data.history);
                if (JSON.stringify(serverHistory) !== JSON.stringify(history)) {
                    setHistory(serverHistory);
                    goToLastMove();
                }
            }

            if (
                data.gameStarted &&
                gameStatus === "modeSelection" &&
                playSide
            ) {
                startGame();
            } else if (!data.gameStarted && gameStatus === "playingVsFriend") {
                setGameStatus("modeSelection");
                playSound("game-end");
                resetChessBoard();
            }
        },
        [
            customGameData,
            gameStatus,
            resetChessBoard,
            setCustomGameData,
            setPlaySide,
            startGame,
            updateInvertedColor,
            goToLastMove,
            history,
            setGameStatus,
            setHistory,
        ]
    );

    return useCallback(
        (props: FetchCallbackProps = {}) => {
            if (!customGameData) {
                return;
            }

            const params = new URLSearchParams();
            params.append("userName", customGameData.userName);

            Object.entries(props).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== false) {
                    if (value === true) params.append(key, "on");
                    else params.append(key, value);
                }
            });

            return postData(params)
                .then((res) => res.json())
                .then(processServerConnection)
                .catch((err) => console.error("Fetch error:", err));
        },
        [customGameData, processServerConnection]
    );
}

export default useFetchCallback;
