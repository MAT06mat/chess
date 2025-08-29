import GameStateTitle from "../../Components/GameStateTitle";
import ModeSelectionPanel from "./Panels/ModeSelectionPanel";
import GameEndPanel from "./Panels/GameEndPanel";
import PlaySandBoxPanel from "./Panels/PlaySandBoxPanel";
import PlayVsFriendPanel from "./Panels/PlayVsFriendPanel";
import PlayVsBotPanel from "./Panels/PlayVsBotPanel";
import { useGameStateStore } from "../../services/stores/useGameStateStore";
import { useCustomGameStore } from "../../services/stores/useCustomGameStore";
import ThreePlayersPanel from "./Panels/3PlayersPanel";
import "../../styles/BoardPanel.scss";

function BoardPanel() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const customGame = useCustomGameStore((state) => state.customGame);

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

    return (
        <div className={"board-panel " + gameStatus}>
            <div className="board-panel-header">
                <GameStateTitle onlyComputerScreen />
            </div>
            {panelContent}
        </div>
    );
}

export default BoardPanel;
