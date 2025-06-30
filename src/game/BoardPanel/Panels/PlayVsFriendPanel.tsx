import useGameContext from "../../../hooks/useGameContext";
import CapturedPiecesContainer from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";
import ColorToPlayBox from "../Components/ColorToPlayBox";
import PanelMovesList from "../Components/PanelMovesList";

function PlayVsFriendPanel() {
    const { colorToPlay } = useGameContext();

    return (
        <>
            <div className="board-panel-content">
                <ColorToPlayBox colorToPlay={colorToPlay} />
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
