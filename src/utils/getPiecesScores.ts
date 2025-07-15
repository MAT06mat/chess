import { PiecesScores, Piece, BoardPosition } from "../types";
import getDefaultPieces from "./getDefaultPieces";

function countPieces(pieces: Piece[]) {
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

function countCapturedPieces(
    pieces: Map<string, number>,
    defaultBoard: Piece[]
) {
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
    return capturedPieces.filter((p) => p[1] !== 0);
}

const piecesScoreMap = new Map();
piecesScoreMap.set("q", 9);
piecesScoreMap.set("r", 5);
piecesScoreMap.set("n", 3);
piecesScoreMap.set("b", 3);
piecesScoreMap.set("p", 1);

function getScores(pieces: Map<string, number>) {
    let whiteScore = 0;
    let blackScore = 0;

    pieces.forEach((value, key) => {
        if (!piecesScoreMap.get(key[1])) return;
        if (key[0] === "w") {
            blackScore += piecesScoreMap.get(key[1]) * value;
        } else {
            whiteScore += piecesScoreMap.get(key[1]) * value;
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

function getPiecesScores(
    movesHistory: BoardPosition[],
    actualMove: number
): PiecesScores {
    const actualBoard = movesHistory[actualMove].pieces;
    const piecesNumber = countPieces(actualBoard);
    const capturedPiecesNumber = countCapturedPieces(
        piecesNumber,
        getDefaultPieces()
    );
    const [whiteScore, blackScore] = getScores(piecesNumber);
    const whitePieces = capturedPiecesNumber.filter((p) => p[0][0] === "w");
    const blackPieces = capturedPiecesNumber.filter((p) => p[0][0] === "b");
    whitePieces.sort(customSort);
    blackPieces.sort(customSort);
    return {
        w: {
            score: whiteScore,
            pieces: whitePieces,
        },
        b: { score: blackScore, pieces: blackPieces },
    };
}

export default getPiecesScores;
