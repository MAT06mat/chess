import defaultBoard from "../assets/defaultBoard";
import useGameContext from "../hooks/useGameContext";
import "../styles/CapturedPieces.scss";
import { piece } from "./Piece";

function countPieces(pieces: piece[]) {
    const piecesNumber = new Map();
    for (let i = 0; i < pieces.length; i += 1) {
        let n = 0;
        if (piecesNumber.get(pieces[i].type)) {
            n = piecesNumber.get(pieces[i].type);
        }
        piecesNumber.set(pieces[i].type, n + 1);
    }
    return piecesNumber;
}

function countCapturedPieces(pieces: Map<string, number>) {
    const capturedPieces: [string, number][] = [];
    const defaultBoardPieces = countPieces(defaultBoard);
    defaultBoardPieces.forEach((value, key) => {
        const n = pieces.get(key);
        if (n === undefined) {
            capturedPieces.push([key, value]);
        } else {
            capturedPieces.push([key, Math.max(value - n, 0)]);
        }
    });
    return capturedPieces;
}

const piecesScore = new Map();
piecesScore.set("q", 9);
piecesScore.set("r", 5);
piecesScore.set("n", 3);
piecesScore.set("b", 3);
piecesScore.set("p", 1);

function getScores(pieces: Map<string, number>) {
    let whiteScore = 0;
    let blackScore = 0;

    pieces.forEach((value, key) => {
        if (!piecesScore.get(key[1])) return;
        if (key[0] === "w") {
            blackScore += piecesScore.get(key[1]) * value;
        } else {
            whiteScore += piecesScore.get(key[1]) * value;
        }
    });

    if (whiteScore > blackScore) {
        whiteScore -= blackScore;
        blackScore = 0;
    } else if (whiteScore < blackScore) {
        blackScore -= whiteScore;
        whiteScore = 0;
    } else {
        whiteScore = 0;
        blackScore = 0;
    }

    return [whiteScore, blackScore];
}

const customOrder = ["p", "b", "n", "r", "q"];

const orderMap = Object.fromEntries(
    customOrder.map((char, index) => [char, index])
);

const customSort = (a: [string, number], b: [string, number]) => {
    const charA = a[0][1];
    const charB = b[0][1];

    const indexA = orderMap[charA] ?? Infinity;
    const indexB = orderMap[charB] ?? Infinity;

    return indexA - indexB;
};

function CapturedPiecesDiv(
    color: "w" | "b",
    score: number,
    pieces: [string, number][]
) {
    pieces = pieces.filter((p) => p[0][0] == color);
    pieces.sort(customSort);

    return (
        <div className="captured-pieces">
            {pieces.map(([key, value]) => {
                if (!value) return;
                const classNumber = value !== 1 ? "-" + value : "";
                const className =
                    "captured-pieces-" + key[0] + classNumber + "-" + key[1];
                return <span key={key} className={className}></span>;
            })}
            {score ? (
                <span className="captured-piece-score">+{score}</span>
            ) : null}
        </div>
    );
}

function CapturedPieces() {
    const { movesHistory } = useGameContext();
    const actualBoard = movesHistory[movesHistory.length - 1].pieces;
    const piecesNumber = countPieces(actualBoard);
    const capturedPiecesNumber = countCapturedPieces(piecesNumber);
    const [whiteScore, blackScore] = getScores(piecesNumber);

    return (
        <div className="captured-pieces-div">
            {CapturedPiecesDiv("b", blackScore, capturedPiecesNumber)}
            {CapturedPiecesDiv("w", whiteScore, capturedPiecesNumber)}
        </div>
    );
}

export default CapturedPieces;
