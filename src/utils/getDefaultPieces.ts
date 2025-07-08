import { Piece } from "../types";

const defaultPieces: Piece[] = [
    { type: "n", color: "w", x: 6, y: 0, id: 0 },
    { type: "n", color: "w", x: 1, y: 0, id: 1 },
    { type: "b", color: "w", x: 2, y: 0, id: 2 },
    { type: "b", color: "w", x: 5, y: 0, id: 3 },
    { type: "q", color: "w", x: 3, y: 0, id: 4 },
    { type: "k", color: "w", x: 4, y: 0, id: 5 },
    { type: "r", color: "w", x: 0, y: 0, id: 6 },
    { type: "r", color: "w", x: 7, y: 0, id: 7 },
    { type: "p", color: "w", x: 0, y: 1, id: 8 },
    { type: "p", color: "w", x: 1, y: 1, id: 9 },
    { type: "p", color: "w", x: 2, y: 1, id: 10 },
    { type: "p", color: "w", x: 3, y: 1, id: 11 },
    { type: "p", color: "w", x: 4, y: 1, id: 12 },
    { type: "p", color: "w", x: 5, y: 1, id: 13 },
    { type: "p", color: "w", x: 6, y: 1, id: 14 },
    { type: "p", color: "w", x: 7, y: 1, id: 15 },
    { type: "n", color: "b", x: 6, y: 7, id: 16 },
    { type: "n", color: "b", x: 1, y: 7, id: 17 },
    { type: "b", color: "b", x: 2, y: 7, id: 18 },
    { type: "b", color: "b", x: 5, y: 7, id: 19 },
    { type: "q", color: "b", x: 3, y: 7, id: 20 },
    { type: "k", color: "b", x: 4, y: 7, id: 21 },
    { type: "r", color: "b", x: 0, y: 7, id: 22 },
    { type: "r", color: "b", x: 7, y: 7, id: 23 },
    { type: "p", color: "b", x: 0, y: 6, id: 24 },
    { type: "p", color: "b", x: 1, y: 6, id: 25 },
    { type: "p", color: "b", x: 2, y: 6, id: 26 },
    { type: "p", color: "b", x: 3, y: 6, id: 27 },
    { type: "p", color: "b", x: 4, y: 6, id: 28 },
    { type: "p", color: "b", x: 5, y: 6, id: 29 },
    { type: "p", color: "b", x: 6, y: 6, id: 30 },
    { type: "p", color: "b", x: 7, y: 6, id: 31 },
];

function getDefaultPieces() {
    return structuredClone(defaultPieces);
}

export default getDefaultPieces;
