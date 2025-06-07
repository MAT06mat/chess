import { boardPosition } from "../assets/defaultBoard";
import "../styles/BoardPanel.scss";

interface BoardPanelProps {
    movesHistory: boardPosition[];
    setMovesHistory: React.Dispatch<React.SetStateAction<boardPosition[]>>;
}

interface pNI {
    p: string;
    n: string;
    b: string;
    q: string;
    k: string;
}

const pN = {
    p: "",
    r: "R",
    n: "N",
    b: "B",
    q: "Q",
    k: "K",
};

const cN = "abcdefgh";

function BoardPanel({ movesHistory }: BoardPanelProps) {
    const chessMoves = movesHistory.map((moveHistory) => {
        if (!moveHistory.lastMove) return "";

        const p = moveHistory.lastMove?.piece.type[1];
        const x = moveHistory.lastMove?.toX;
        const y = moveHistory.lastMove?.toY;

        return pN[p as keyof pNI] + cN[x ? x : 0] + (y + 1);
    });

    return (
        <div className="board-panel">
            <div className="board-panel-header"></div>
            <div className="board-panel-content">
                {chessMoves.map((m, i) => {
                    return <div key={i}>{m}</div>;
                })}
            </div>
            <div className="board-panel-footer"></div>
        </div>
    );
}

export default BoardPanel;
