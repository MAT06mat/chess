import useGameContext from "../../../hooks/useGameContext";
import CapturedPieces from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";
import ColorToPlayBox from "../Components/ColorToPlayBox";
import PanelMovesList from "../Components/PanelMovesList";

function PlayVsFriendPanel() {
    const { colorToPlay } = useGameContext();

    return (
        <>
            <div className="board-panel-content">
                <ColorToPlayBox colorToPlay={colorToPlay} />
                <CapturedPieces />
                <PanelMovesList />
            </div>
            <div className="board-panel-footer">
                <BoardActions reset undo redo />
            </div>
        </>
    );
}

export default PlayVsFriendPanel;
