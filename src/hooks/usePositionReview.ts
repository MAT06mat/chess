import { useEffect, useRef } from "react";
import postChessApi from "../utils/postChessApi";
import { BoardPosition } from "../types";
import { useBoardStore } from "../stores/useBoardStore";
import { useGameStateStore } from "../stores/useGameStateStore";

function usePositionReview(
    updatePercentage: (
        actualMove: number,
        colorWinner: string | null,
        movesHistory: BoardPosition[]
    ) => void
) {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const gameReview = useGameStateStore((state) => state.gameReview);
    const colorWinner = useGameStateStore((state) => state.colorWinner);

    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const calculateFenRef = useRef<string | null>(null);

    useEffect(() => {
        if (gameStatus !== "gameEnd" || !gameReview) return;
        if (currentMove >= history.length - 1) return;

        const actualBoard = history[currentMove];
        if (actualBoard.chessApiData !== undefined) return;
        if (calculateFenRef.current !== null) return;
        calculateFenRef.current = actualBoard.fen;

        postChessApi({ fen: actualBoard.fen })
            .then((data) => {
                calculateFenRef.current = null;
                actualBoard.chessApiData = data;
                updatePercentage(currentMove, colorWinner, history);
                if (data.type === "error") {
                    console.error("Error fetching chess API data:", data);
                }
            })
            .catch((error) => {
                console.error("Error while fetching chess API data:", error);
                calculateFenRef.current = null;
            });
    }, [
        history,
        gameStatus,
        currentMove,
        gameReview,
        updatePercentage,
        colorWinner,
    ]);
}

export default usePositionReview;
