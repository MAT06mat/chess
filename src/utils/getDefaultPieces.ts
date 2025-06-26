import piece from "../types/piece";

const defaultPieces: piece[] = [
    { type: "wn", x: 6, y: 0, id: 0 },
    { type: "wn", x: 1, y: 0, id: 1 },
    { type: "wb", x: 2, y: 0, id: 2 },
    { type: "wb", x: 5, y: 0, id: 3 },
    { type: "wq", x: 3, y: 0, id: 4 },
    { type: "wk", x: 4, y: 0, id: 5 },
    { type: "wr", x: 0, y: 0, id: 6 },
    { type: "wr", x: 7, y: 0, id: 7 },
    { type: "wp", x: 0, y: 1, id: 8 },
    { type: "wp", x: 1, y: 1, id: 9 },
    { type: "wp", x: 2, y: 1, id: 10 },
    { type: "wp", x: 3, y: 1, id: 11 },
    { type: "wp", x: 4, y: 1, id: 12 },
    { type: "wp", x: 5, y: 1, id: 13 },
    { type: "wp", x: 6, y: 1, id: 14 },
    { type: "wp", x: 7, y: 1, id: 15 },
    { type: "bn", x: 6, y: 7, id: 16 },
    { type: "bn", x: 1, y: 7, id: 17 },
    { type: "bb", x: 2, y: 7, id: 18 },
    { type: "bb", x: 5, y: 7, id: 19 },
    { type: "bq", x: 3, y: 7, id: 20 },
    { type: "bk", x: 4, y: 7, id: 21 },
    { type: "br", x: 0, y: 7, id: 22 },
    { type: "br", x: 7, y: 7, id: 23 },
    { type: "bp", x: 0, y: 6, id: 24 },
    { type: "bp", x: 1, y: 6, id: 25 },
    { type: "bp", x: 2, y: 6, id: 26 },
    { type: "bp", x: 3, y: 6, id: 27 },
    { type: "bp", x: 4, y: 6, id: 28 },
    { type: "bp", x: 5, y: 6, id: 29 },
    { type: "bp", x: 6, y: 6, id: 30 },
    { type: "bp", x: 7, y: 6, id: 31 },
];

function getDefaultPieces() {
    return structuredClone(defaultPieces);
}

export default getDefaultPieces;
