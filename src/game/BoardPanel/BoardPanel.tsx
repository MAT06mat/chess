import Title from "../Components/Title";
import "../../styles/BoardPanel.scss";
import ModeSelectionPanel from "./Panels/ModeSelectionPanel";
import GameEndPanel from "./Panels/GameEndPanel";
import PlaySandBoxPanel from "./Panels/PlaySandBoxPanel";
import PlayVsFriendPanel from "./Panels/PlayVsFriendPanel";
import PlayVsBotPanel from "./Panels/PlayVsBotPanel";
import { useGameStateStore } from "../../services/stores/useGameStateStore";

function BoardPanel() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);

    let panelContent = null;
    if (gameStatus === "modeSelection") {
        panelContent = <ModeSelectionPanel />;
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
                <Title onlyComputerScreen />
            </div>
            {panelContent}
        </div>
    );
}

export default BoardPanel;
