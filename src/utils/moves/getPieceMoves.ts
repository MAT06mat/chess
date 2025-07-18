import { RelativeMove } from "../../types";

interface movesProps {
    p: RelativeMove[];
    k: RelativeMove[];
    r: RelativeMove[];
    b: RelativeMove[];
    q: RelativeMove[];
    n: RelativeMove[];
}

const moves: movesProps = {
    p: [
        { x: 0, y: -1, group: 0 },
        { x: 0, y: -2, group: 0 },
        { x: -1, y: -1, group: 1 },
        { x: 1, y: -1, group: 2 },
        { x: 0, y: 1, group: 3 },
        { x: 0, y: 2, group: 3 },
        { x: 1, y: 1, group: 4 },
        { x: -1, y: 1, group: 5 },
    ],
    k: [
        { x: 1, y: 0, group: 0 },
        { x: 2, y: 0, group: 0 },
        { x: -1, y: 0, group: 1 },
        { x: -2, y: 0, group: 1 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
    ],
    r: [
        { x: 1, y: 0, group: 0 },
        { x: 2, y: 0, group: 0 },
        { x: 3, y: 0, group: 0 },
        { x: 4, y: 0, group: 0 },
        { x: 5, y: 0, group: 0 },
        { x: 6, y: 0, group: 0 },
        { x: 7, y: 0, group: 0 },
        { x: -1, y: 0, group: 1 },
        { x: -2, y: 0, group: 1 },
        { x: -3, y: 0, group: 1 },
        { x: -4, y: 0, group: 1 },
        { x: -5, y: 0, group: 1 },
        { x: -6, y: 0, group: 1 },
        { x: -7, y: 0, group: 1 },
        { x: 0, y: 1, group: 2 },
        { x: 0, y: 2, group: 2 },
        { x: 0, y: 3, group: 2 },
        { x: 0, y: 4, group: 2 },
        { x: 0, y: 5, group: 2 },
        { x: 0, y: 6, group: 2 },
        { x: 0, y: 7, group: 2 },
        { x: 0, y: -1, group: 3 },
        { x: 0, y: -2, group: 3 },
        { x: 0, y: -3, group: 3 },
        { x: 0, y: -4, group: 3 },
        { x: 0, y: -5, group: 3 },
        { x: 0, y: -6, group: 3 },
        { x: 0, y: -7, group: 3 },
    ],
    b: [
        { x: 1, y: 1, group: 0 },
        { x: 2, y: 2, group: 0 },
        { x: 3, y: 3, group: 0 },
        { x: 4, y: 4, group: 0 },
        { x: 5, y: 5, group: 0 },
        { x: 6, y: 6, group: 0 },
        { x: 7, y: 7, group: 0 },
        { x: -1, y: 1, group: 1 },
        { x: -2, y: 2, group: 1 },
        { x: -3, y: 3, group: 1 },
        { x: -4, y: 4, group: 1 },
        { x: -5, y: 5, group: 1 },
        { x: -6, y: 6, group: 1 },
        { x: -7, y: 7, group: 1 },
        { x: 1, y: -1, group: 2 },
        { x: 2, y: -2, group: 2 },
        { x: 3, y: -3, group: 2 },
        { x: 4, y: -4, group: 2 },
        { x: 5, y: -5, group: 2 },
        { x: 6, y: -6, group: 2 },
        { x: 7, y: -7, group: 2 },
        { x: -1, y: -1, group: 3 },
        { x: -2, y: -2, group: 3 },
        { x: -3, y: -3, group: 3 },
        { x: -4, y: -4, group: 3 },
        { x: -5, y: -5, group: 3 },
        { x: -6, y: -6, group: 3 },
        { x: -7, y: -7, group: 3 },
    ],
    q: [
        { x: 1, y: 0, group: 0 },
        { x: 2, y: 0, group: 0 },
        { x: 3, y: 0, group: 0 },
        { x: 4, y: 0, group: 0 },
        { x: 5, y: 0, group: 0 },
        { x: 6, y: 0, group: 0 },
        { x: 7, y: 0, group: 0 },
        { x: -1, y: 0, group: 1 },
        { x: -2, y: 0, group: 1 },
        { x: -3, y: 0, group: 1 },
        { x: -4, y: 0, group: 1 },
        { x: -5, y: 0, group: 1 },
        { x: -6, y: 0, group: 1 },
        { x: -7, y: 0, group: 1 },
        { x: 0, y: 1, group: 2 },
        { x: 0, y: 2, group: 2 },
        { x: 0, y: 3, group: 2 },
        { x: 0, y: 4, group: 2 },
        { x: 0, y: 5, group: 2 },
        { x: 0, y: 6, group: 2 },
        { x: 0, y: 7, group: 2 },
        { x: 0, y: -1, group: 3 },
        { x: 0, y: -2, group: 3 },
        { x: 0, y: -3, group: 3 },
        { x: 0, y: -4, group: 3 },
        { x: 0, y: -5, group: 3 },
        { x: 0, y: -6, group: 3 },
        { x: 0, y: -7, group: 3 },
        { x: 1, y: 1, group: 4 },
        { x: 2, y: 2, group: 4 },
        { x: 3, y: 3, group: 4 },
        { x: 4, y: 4, group: 4 },
        { x: 5, y: 5, group: 4 },
        { x: 6, y: 6, group: 4 },
        { x: 7, y: 7, group: 4 },
        { x: -1, y: 1, group: 5 },
        { x: -2, y: 2, group: 5 },
        { x: -3, y: 3, group: 5 },
        { x: -4, y: 4, group: 5 },
        { x: -5, y: 5, group: 5 },
        { x: -6, y: 6, group: 5 },
        { x: -7, y: 7, group: 5 },
        { x: 1, y: -1, group: 6 },
        { x: 2, y: -2, group: 6 },
        { x: 3, y: -3, group: 6 },
        { x: 4, y: -4, group: 6 },
        { x: 5, y: -5, group: 6 },
        { x: 6, y: -6, group: 6 },
        { x: 7, y: -7, group: 6 },
        { x: -1, y: -1, group: 7 },
        { x: -2, y: -2, group: 7 },
        { x: -3, y: -3, group: 7 },
        { x: -4, y: -4, group: 7 },
        { x: -5, y: -5, group: 7 },
        { x: -6, y: -6, group: 7 },
        { x: -7, y: -7, group: 7 },
    ],
    n: [
        { x: 1, y: 2 },
        { x: -1, y: 2 },
        { x: 1, y: -2 },
        { x: -1, y: -2 },
        { x: 2, y: 1 },
        { x: -2, y: 1 },
        { x: 2, y: -1 },
        { x: -2, y: -1 },
    ],
};

function getPieceMoves(pieceType: string): RelativeMove[] {
    return structuredClone(moves[pieceType as keyof movesProps] || []);
}

export default getPieceMoves;
