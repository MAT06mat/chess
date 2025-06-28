import CapturedPieces from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";

function PlaySandBoxPanel() {
    return (
        <>
            <div className="board-panel-content">
                <CapturedPieces />
            </div>
            <div className="board-panel-footer">
                <BoardActions />
            </div>
        </>
    );
}

export default PlaySandBoxPanel;
