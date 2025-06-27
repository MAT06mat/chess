import Title from "../Title";
import useGameContext from "../../hooks/useGameContext";
import "../../styles/BoardPanel.scss";
import PlayVsPanel from "./PlayVsPanel";
import ModeSelectionPanel from "./ModeSelectionPanel";
import GameEndPanel from "./GameEndPanel";

function BoardPanel() {
    const { gameStatus } = useGameContext();

    let panelContent = null;

    if (gameStatus === "modeSelection") {
        panelContent = <ModeSelectionPanel />;
    } else if (
        gameStatus === "playingVsBot" ||
        gameStatus === "playingVsFriend" ||
        gameStatus === "playingSandBox"
    ) {
        panelContent = <PlayVsPanel />;
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
