import useGameContext from "../../hooks/useGameContext";
import useIsMobile from "../../hooks/useIsMobile";
import "../../styles/CapturedPieces.scss";

function classNameFormat(key: string, value: number) {
    const classNumber = value !== 1 ? "-" + value : "";
    const className = "captured-pieces-" + key[0] + classNumber + "-" + key[1];
    return className;
}

interface CapturedPiecesProps {
    color: "w" | "b";
    onlyComputerScreen?: boolean;
}

function CapturedPieces({ color, onlyComputerScreen }: CapturedPiecesProps) {
    const { piecesScores } = useGameContext();
    const pieces = piecesScores[color].pieces;
    const score = piecesScores[color].score;

    if (useIsMobile() && onlyComputerScreen) {
        return null;
    }

    return (
        <div className="captured-pieces">
            {pieces.map(([key, value]) => (
                <span key={key} className={classNameFormat(key, value)} />
            ))}
            {score ? (
                <span className="captured-piece-score">+{score}</span>
            ) : null}
        </div>
    );
}

function CapturedPiecesContainer() {
    if (!useIsMobile()) {
        return null;
    }

    return (
        <div className="captured-pieces-container">
            <CapturedPieces color="b" />
            <CapturedPieces color="w" />
        </div>
    );
}

export { CapturedPieces };
export default CapturedPiecesContainer;
