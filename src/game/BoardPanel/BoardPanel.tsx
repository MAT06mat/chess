import GameStateTitle from "../../Components/GameStateTitle";
import "../../styles/BoardPanel.scss";
import ModeSelectionPanel from "./Panels/ModeSelectionPanel";
import GameEndPanel from "./Panels/GameEndPanel";
import PlaySandBoxPanel from "./Panels/PlaySandBoxPanel";
import PlayVsFriendPanel from "./Panels/PlayVsFriendPanel";
import PlayVsBotPanel from "./Panels/PlayVsBotPanel";
import { useGameStateStore } from "../../services/stores/useGameStateStore";
import { useCustomGameStore } from "../../services/stores/useCustomGameStore";
import ThreePlayersPanel from "./Panels/3PlayersPanel";
import FenModal from "../../Components/FenModal";
import { useModalStore } from "../../services/stores/useModalStore";
import SettingsCog from "../../assets/svg/SettingsCog";
import { useState } from "react";
import GreyButton from "../../Components/ui/GreyButton";

function BoardPanel() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const customGame = useCustomGameStore((state) => state.customGame);

    const [settingsOpen, setSettingsOpen] = useState(false);

    const addModal = useModalStore((state) => state.addModal);

    function openFenModal() {
        addModal(<FenModal />);
    }

    let panelContent = null;
    if (gameStatus === "modeSelection") {
        if (customGame === "3Players") {
            panelContent = <ThreePlayersPanel />;
        } else {
            panelContent = <ModeSelectionPanel />;
        }
    } else if (gameStatus === "playingVsFriend") {
        panelContent = <PlayVsFriendPanel />;
    } else if (gameStatus === "playingVsBot") {
        panelContent = <PlayVsBotPanel />;
    } else if (gameStatus === "playingSandBox") {
        panelContent = <PlaySandBoxPanel />;
    } else {
        panelContent = <GameEndPanel />;
    }

    const settingsDiv = (
        <div className="settings-div">
            <GreyButton text="FEN" onClick={openFenModal} />
        </div>
    );

    return (
        <div className={"board-panel " + gameStatus}>
            <div className="board-panel-header">
                <GameStateTitle onlyComputerScreen />
                <button
                    className="open-settings"
                    onClick={() => setSettingsOpen((prev) => !prev)}
                >
                    <SettingsCog />
                </button>
            </div>
            {settingsOpen ? settingsDiv : null}
            {panelContent}
        </div>
    );
}

export default BoardPanel;
