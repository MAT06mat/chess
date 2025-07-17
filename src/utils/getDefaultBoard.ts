import { BoardPosition } from "../types";
import getDefaultPieces from "./getDefaultPieces";

function getDefaultBoard(): BoardPosition {
    return {
        pieces: getDefaultPieces(),
        shapes: [],
        lastMove: null,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        chessApiData: {
            text: "Move e2 → e4 (e4): [0.28]. The game is balanced. Depth 12.",
            captured: false,
            promotion: false,
            isCapture: false,
            isPromotion: false,
            isCastling: false,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            type: "bestmove",
            depth: 12,
            move: "e2e4",
            eval: 0.28,
            centipawns: 28,
            mate: null,
            continuationArr: [
                "e7e5",
                "g1f3",
                "b8c6",
                "f1b5",
                "a7a6",
                "b5a4",
                "g8f6",
                "e1g1",
                "f6e4",
                "d2d4",
                "b7b5",
                "a4b3",
                "e5d4",
            ],
            winChance: 52.57517538936253,
            taskId: "kmb9hey25",
            turn: "w",
            color: "w",
            piece: "p",
            from: "e2",
            to: "e4",
            san: "e4",
            flags: "b",
            lan: "e2e4",
            fromNumeric: [5, 2],
            toNumeric: [5, 4],
            continuation: [
                {
                    from: "e7",
                    to: "e5",
                    fromNumeric: [5, 7],
                    toNumeric: [5, 5],
                },
                {
                    from: "g1",
                    to: "f3",
                    fromNumeric: [7, 1],
                    toNumeric: [6, 3],
                },
            ],
        },
    };
}

export default getDefaultBoard;
