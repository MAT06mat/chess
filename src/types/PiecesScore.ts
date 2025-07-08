type PiecesScore = {
    score: number;
    pieces: [string, number][];
};

type PiecesScores = {
    w: PiecesScore;
    b: PiecesScore;
};

export type { PiecesScores };
