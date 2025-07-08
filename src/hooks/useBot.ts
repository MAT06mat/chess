import { useEffect, useRef } from "react";
import useGameContext from "./useGameContext";
import { CompleteMove, RelativeMove, PostChessApiResponse } from "../types";
import postChessApi from "../utils/postChessApi";
import useCallbackRegisterMove from "./useCallbackRegisterMove";
import getCompleteMove from "../utils/moves/getCompleteMove";
import getBotOpening from "../utils/getBotOpening";
import random from "random";

function useBot(validMoves: Map<number, RelativeMove[]>, useBot: boolean) {
    const { invertedColor, colorToPlay, movesHistory, actualMove, gameStatus } =
        useGameContext();

    const calculateFenRef = useRef<string | null>(null);
    const validMovesRef = useRef(validMoves);
    const gameStatusRef = useRef(gameStatus);
    const pieces = movesHistory[actualMove].pieces;

    if (actualMove !== movesHistory.length - 1) {
        calculateFenRef.current = null;
    }

    const registerMove = useCallbackRegisterMove();

    function playMove(
        fen: string,
        move: CompleteMove,
        postChessApiResponse?: PostChessApiResponse
    ) {
        setTimeout(() => {
            if (gameStatusRef.current !== "playingVsBot") {
                calculateFenRef.current = null;
            }
            if (calculateFenRef.current === fen) {
                calculateFenRef.current = null;
                registerMove(move, pieces, postChessApiResponse);
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

    useEffect(() => {
        gameStatusRef.current = gameStatus;
        if (!useBot || actualMove !== movesHistory.length - 1) return;

        if (colorToPlay === (invertedColor ? "w" : "b")) {
            validMovesRef.current = validMoves;
            if (calculateFenRef.current !== null) return;

            const fen = movesHistory[actualMove].fen;

            calculateFenRef.current = fen;

            if (movesHistory.length === 1) {
                return playMove(fen, getBotOpening());
            }

            postChessApi({
                fen: fen,
            }).then((data) => {
                if (data.type === "error") return playRandomMove(fen);

                const fromX = data.fromNumeric[0] - 1;
                const fromY = data.fromNumeric[1] - 1;
                const toX = data.toNumeric[0] - 1;
                const toY = data.toNumeric[1] - 1;

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

                if (data.isCapture) {
                    completeMove.capture = true;
                }
                if (data.isCastling) {
                    completeMove.special = "castling";
                }
                if (data.isPromotion && data.promotion) {
                    completeMove.special = "promotion";
                    completeMove.toPiece = {
                        type: data.promotion,
                        color: selectedPiece.color,
                        x: toX,
                        y: toY,
                        id: selectedPiece.id,
                    };
                }
                playMove(fen, completeMove, data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculateFenRef, validMoves, useBot, gameStatus]);
}

export default useBot;
