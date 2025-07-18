import BoardActions from "../Components/BaordActions";

function PlaySandBoxPanel() {
    return (
        <>
            <div className="board-panel-content" />
            <div className="board-panel-footer">
                <BoardActions reset undo redo />
            </div>
        </>
    );
}

export default PlaySandBoxPanel;
