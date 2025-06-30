import { useEffect, useRef } from "react";
import useGameContext from "./useGameContext";
import { completeMove, move } from "../types";
import postChessApi from "../utils/postChessApi";
import getFen from "../utils/getFen";
import useCallbackRegisterMove from "./useCallbackRegisterMove";
import getCompleteMove from "../utils/moves/getCompleteMove";
import getBotOpening from "../utils/getBotOpening";
import random from "random";

function useBot(validMoves: Map<number, move[]>, useBot: boolean) {
    const { invertedColor, colorToPlay, movesHistory, actualMove, gameStatus } =
        useGameContext();

    const calculateFenRef = useRef<string | null>(null);
    const validMovesRef = useRef(validMoves);
    const gameStatusRef = useRef(gameStatus);
    const pieces = movesHistory[actualMove].pieces;

    if (actualMove !== movesHistory.length - 1) {
        calculateFenRef.current = null;
    }

    function playMove(fen: string, move: completeMove) {
        setTimeout(() => {
            if (gameStatusRef.current !== "playingVsBot") {
                calculateFenRef.current = null;
            }
            if (calculateFenRef.current === fen) {
                calculateFenRef.current = null;
                registerMove(move, pieces);
            }
        }, random.int(500, 1000));
    }

    function playRandomMove(fen: string) {
        console.error("Error while playing bot move. Playing random");

        const moves = new Map(
            Array.from(validMovesRef.current.entries()).filter(
                ([, moves]) => moves.length > 0
            )
        );

        const pieceIndex = random.int(0, moves.size - 1);
        const [pieceId, pieceMoves] = [...moves.entries()][pieceIndex];
        const selectedPiece = pieces.find((p) => p.id === pieceId);
        if (selectedPiece === undefined) return;
        const move = pieceMoves[random.int(0, pieceMoves.length - 1)];

        const completeMove = getCompleteMove(move, selectedPiece);

        playMove(fen, completeMove);
    }

    const registerMove = useCallbackRegisterMove();

    useEffect(() => {
        gameStatusRef.current = gameStatus;
        if (!useBot) return;

        if (colorToPlay === (invertedColor ? "w" : "b")) {
            validMovesRef.current = validMoves;
            if (calculateFenRef.current !== null) return;

            const fen = getFen(movesHistory, colorToPlay, actualMove);

            calculateFenRef.current = fen;

            if (movesHistory.length === 1) {
                return playMove(fen, getBotOpening());
            }

            postChessApi({
                fen: fen,
            }).then((data) => {
                if (data.type === "error") return playRandomMove(fen);

                const fromX = "abcdefgh".indexOf(data.from[0]);
                const fromY = data.from[1] - 1;
                const toX = "abcdefgh".indexOf(data.to[0]);
                const toY = data.to[1] - 1;

                const selectedPiece = pieces.find(
                    (p) => p.x === fromX && p.y === fromY
                );

                if (selectedPiece === undefined) return playRandomMove(fen);

                const pieceMoves = validMovesRef.current.get(selectedPiece?.id);
                const move = pieceMoves?.find(
                    (m) => m.x === toX - fromX && m.y === toY - fromY
                );

                if (move === undefined) return playRandomMove(fen);

                const completeMove = getCompleteMove(move, selectedPiece);
                playMove(fen, completeMove);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculateFenRef, validMoves, useBot, gameStatus]);
}

export default useBot;
