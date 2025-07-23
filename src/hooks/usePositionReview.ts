import { useEffect } from "react";
import useChessApi from "../stores/useChessApi";
import { BoardPosition } from "../types";
import { useBoardStore } from "../stores/useBoardStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useCurrentBoard } from "../stores/useBoardSelectors";

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

    const currentBoard = useCurrentBoard();
    const fen = currentBoard.fen;

    const { data, isSuccess, refetch } = useChessApi({ fen }, "review");

    const shouldFetch =
        gameStatus === "gameEnd" &&
        gameReview &&
        currentMove < history.length - 1 &&
        !currentBoard.chessApiData;

    useEffect(() => {
        if (!shouldFetch) return;
        refetch();
    }, [shouldFetch, refetch]);

    useEffect(() => {
        if (!isSuccess || !data) return;

        currentBoard.chessApiData = data;
        updatePercentage(currentMove, colorWinner, history);
        if (data.type === "error") {
            console.error("Error fetching chess API data:", data);
        }
    }, [
        isSuccess,
        data,
        currentMove,
        colorWinner,
        history,
        currentBoard,
        updatePercentage,
    ]);
}

export default usePositionReview;
