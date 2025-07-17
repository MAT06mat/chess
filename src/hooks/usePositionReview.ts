import { useEffect, useRef } from "react";
import postChessApi from "../utils/postChessApi";
import useGameContext from "./useGameContext";
import { BoardPosition } from "../types";

function usePositionReview(
    updatePercentage: (
        actualMove: number,
        colorWinner: string | null,
        movesHistory: BoardPosition[]
    ) => void
) {
    const { movesHistory, gameStatus, actualMove, gameReview, colorWinner } =
        useGameContext();
    const calculateFenRef = useRef<string | null>(null);

    useEffect(() => {
        if (gameStatus !== "gameEnd" || !gameReview) return;
        if (actualMove >= movesHistory.length - 1) return;

        const actualBoard = movesHistory[actualMove];
        if (actualBoard.chessApiData !== undefined) return;
        if (calculateFenRef.current !== null) return;
        calculateFenRef.current = actualBoard.fen;

        postChessApi({ fen: actualBoard.fen })
            .then((data) => {
                calculateFenRef.current = null;
                actualBoard.chessApiData = data;
                updatePercentage(actualMove, colorWinner, movesHistory);
                if (data.type === "error") {
                    console.error("Error fetching chess API data:", data);
                }
            })
            .catch((error) => {
                console.error("Error while fetching chess API data:", error);
                calculateFenRef.current = null;
            });
    }, [
        movesHistory,
        gameStatus,
        actualMove,
        gameReview,
        updatePercentage,
        colorWinner,
    ]);
}

export default usePositionReview;
