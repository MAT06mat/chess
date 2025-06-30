import CapturedPiecesContainer from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";

function PlaySandBoxPanel() {
    return (
        <>
            <div className="board-panel-content">
                <CapturedPiecesContainer />
            </div>
            <div className="board-panel-footer">
                <BoardActions reset undo redo />
            </div>
        </>
    );
}

export default PlaySandBoxPanel;
