import CapturedPiecesContainer from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";
import ColorToPlayBox from "../Components/ColorToPlayBox";
import PanelMovesList from "../Components/PanelMovesList";

function PlayVsFriendPanel() {
    return (
        <>
            <div className="board-panel-content">
                <ColorToPlayBox />
                <CapturedPiecesContainer />
                <PanelMovesList />
            </div>
            <div className="board-panel-footer">
                <BoardActions resign cancel />
            </div>
        </>
    );
}

export default PlayVsFriendPanel;
