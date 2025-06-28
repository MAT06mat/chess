import CapturedPieces from "../../Components/CapturedPieces";
import BoardActions from "../Components/BaordActions";
import PanelMovesList from "../Components/PanelMovesList";

function PlayVsBotPanel() {
    return (
        <>
            <div className="board-panel-content">
                <CapturedPieces />
                <PanelMovesList />
                <div className="game-controlers">
                    <BoardActions undo redo />
                </div>
            </div>
            <div className="board-panel-footer">
                <BoardActions resign cancel />
            </div>
        </>
    );
}

export default PlayVsBotPanel;
