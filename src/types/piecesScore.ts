type piecesScore = {
    score: number;
    pieces: [string, number][];
};

type piecesScores = {
    w: piecesScore;
    b: piecesScore;
};

export type { piecesScores };
