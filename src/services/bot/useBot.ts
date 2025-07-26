import { useCallback, useEffect, useRef } from "react";
import { CompleteMove, RelativeMove, PostChessApiResponse } from "../../types";
import useChessApi from "../chessApi/useChessApi";
import getCompleteMove from "../engine/getCompleteMove";
import getBotOpening from "./getBotOpening";
import random from "random";
import { useBoardStore } from "../stores/useBoardStore";
import { useColorToPlay, usePieces } from "../stores/useBoardSelectors";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useGameStateStore } from "../stores/useGameStateStore";

function useBot(validMoves: Map<number, RelativeMove[]>) {
    const gameStatus = useGameStateStore((state) => state.gameStatus);

    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const pieces = usePieces();
    const colorToPlay = useColorToPlay();
    const registerMove = useBoardStore((state) => state.registerMove);
    const opponentColor = useSettingsStore((state) => state.opponentColor);

    const requestIdRef = useRef(0);

    const playMove = useCallback(
        (move: CompleteMove, data?: PostChessApiResponse) => {
            const thisRequestId = ++requestIdRef.current;

            const timeoutId = setTimeout(() => {
                if (requestIdRef.current !== thisRequestId) return;

                if (gameStatus !== "playingVsBot") return;

                registerMove(move, pieces, data);
            }, random.int(500, 1000));

            return () => clearTimeout(timeoutId);
        },
        [pieces, registerMove, gameStatus]
    );

    const playRandomMove = useCallback(() => {
        console.warn("[Bot] Error while playing bot move. Playing random");

        const moves = new Map(
            Array.from(validMoves.entries()).filter(
                ([, moves]) => moves.length > 0
            )
        );

        const pieceIndex = random.int(0, moves.size - 1);
        const [pieceId, pieceMoves] = [...moves.entries()][pieceIndex];
        const selectedPiece = pieces.find((p) => p.id === pieceId);
        if (selectedPiece === undefined) return;
        const move = pieceMoves[random.int(0, pieceMoves.length - 1)];

        const completeMove = getCompleteMove(move, selectedPiece);

        playMove(completeMove);
    }, [pieces, playMove, validMoves]);

    const playMoveFromData = useCallback(
        (data: PostChessApiResponse) => {
            if (data.type === "error") {
                console.warn("[Bot] Received error response", data);
                return playRandomMove();
            }

            const fromX = data.fromNumeric[0] - 1;
            const fromY = data.fromNumeric[1] - 1;
            const toX = data.toNumeric[0] - 1;
            const toY = data.toNumeric[1] - 1;

            const selectedPiece = pieces.find(
                (p) => p.x === fromX && p.y === fromY
            );

            if (!selectedPiece) return playRandomMove();

            const pieceMoves = validMoves.get(selectedPiece?.id);
            const move = pieceMoves?.find(
                (m) => m.x === toX - fromX && m.y === toY - fromY
            );

            if (!move) return playRandomMove();

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
            playMove(completeMove, data);
        },
        [pieces, playMove, playRandomMove, validMoves]
    );

    const shouldPlay =
        gameStatus === "playingVsBot" &&
        colorToPlay === opponentColor &&
        currentMove === history.length - 1;

    const fen = history[currentMove]?.fen || "";

    const { data, isSuccess, isPending, refetch } = useChessApi({ fen }, "bot");

    useEffect(() => {
        if (!shouldPlay) return;

        if (history.length === 1) {
            playMove(getBotOpening());
            return;
        }

        refetch();
    }, [shouldPlay, refetch, history.length, playMove]);

    useEffect(() => {
        if (!shouldPlay) return;

        if (isSuccess && data) {
            playMoveFromData(data);
        } else if (!isPending && (!isSuccess || !data)) {
            console.warn("[Bot] No API data or request failed");
            playRandomMove();
        }
    }, [
        shouldPlay,
        isPending,
        isSuccess,
        data,
        playMoveFromData,
        playRandomMove,
    ]);
}

export default useBot;
