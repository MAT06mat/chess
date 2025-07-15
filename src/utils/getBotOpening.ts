import { CompleteMove, Piece } from "../types";
import getDefaultPieces from "./getDefaultPieces";
import random from "random";

const poisson = random.poisson();

function getPiece(x: number, y: number): Piece {
    return (
        getDefaultPieces().find((p) => p.x === x && p.y === y) ||
        getDefaultPieces()[0]
    );
}

const openings: CompleteMove[] = [
    {
        fromX: 4,
        fromY: 1,
        toX: 4,
        toY: 3,
        piece: getPiece(4, 1),
        san: "e4",
    },
    {
        fromX: 3,
        fromY: 1,
        toX: 3,
        toY: 3,
        piece: getPiece(3, 1),
        san: "d4",
    },
    {
        fromX: 6,
        fromY: 0,
        toX: 5,
        toY: 2,
        piece: getPiece(6, 0),
        san: "Nf3",
    },
    {
        fromX: 2,
        fromY: 1,
        toX: 2,
        toY: 3,
        piece: getPiece(2, 1),
        san: "c4",
    },
    {
        fromX: 4,
        fromY: 1,
        toX: 4,
        toY: 2,
        piece: getPiece(4, 1),
        san: "e3",
    },
    {
        fromX: 6,
        fromY: 1,
        toX: 6,
        toY: 2,
        piece: getPiece(6, 1),
        san: "g3",
    },
    {
        fromX: 1,
        fromY: 1,
        toX: 1,
        toY: 2,
        piece: getPiece(1, 1),
        san: "b3",
    },
    {
        fromX: 5,
        fromY: 1,
        toX: 5,
        toY: 3,
        piece: getPiece(5, 1),
        san: "f4",
    },
];

function getBotOpening(): CompleteMove {
    const openingIndex = poisson();
    return openings[openingIndex] || openings[0];
}

export default getBotOpening;
