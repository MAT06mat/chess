import GreenButton from "../../../Components/ui/GreenButton";
import { useCustomGameStore } from "../../../services/stores/useCustomGameStore";
import { useState } from "react";
import GreyButton from "../../../Components/ui/GreyButton";
import ArrowSpinReset from "../../../assets/svg/ArrowSpinReset";
import useFetchCallback, {
    FetchCallbackProps,
} from "../../../services/custom-game/3players/useFetch";
import "../../../styles/ModeSelectionPanel.scss";

type ColorIconProps = {
    color: "white1" | "white2" | "black";
    count?: number;
    onClick: () => void;
};

const ColorIcon = ({ color, count = 0, onClick }: ColorIconProps) => {
    const customGameData = useCustomGameStore((state) => state.customGameData);
    const state = customGameData?.userName ? true : false;

    const baseClass = color.startsWith("white") ? "white" : "black";

    function isSelectedSide(color: string) {
        return color === customGameData?.playSide ? " selected" : "";
    }

    return (
        <div
            className={`color-icon ${baseClass}${isSelectedSide(color)}`}
            onClick={state ? onClick : () => {}}
            style={state ? {} : { opacity: 0.5, cursor: "not-allowed" }}
        >
            <span className="players-number">{count || ""}</span>
        </div>
    );
};

function ThreePlayersPanel() {
    const customGameData = useCustomGameStore((state) => state.customGameData);
    const setCustomGameData = useCustomGameStore(
        (state) => state.setCustomGameData
    );

    const fetchCallback = useFetchCallback();

    function colorIconClick(color: "white1" | "white2" | "black") {
        if (!customGameData) return;

        const colorMap: Record<
            string,
            "whitePlayer1" | "whitePlayer2" | "blackPlayer1"
        > = {
            white1: "whitePlayer1",
            white2: "whitePlayer2",
            black: "blackPlayer1",
        };

        const props: FetchCallbackProps = {};
        props[colorMap[color]] = true;

        fetchCallback(props);
    }

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
                                userName: e.target.value,
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
                            fetchCallback({ resetPlayers: true });
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
                        fetchCallback({ launchGame: true })
                            ?.then(() => setButtonLoading(false))
                            .catch(() => setButtonLoading(false));
                    }}
                />
            </div>
        </>
    );
}

export default ThreePlayersPanel;
