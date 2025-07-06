import { useCallback } from "react";
import useGameContext from "./useGameContext";
import piece from "../types/piece";
import { completeMove, PostChessApiResponse } from "../types";
import isCheck from "../utils/moves/isCheck";
import invertColor from "../utils/invertColor";
import doMove from "../utils/moves/doMove";
import getFen from "../utils/getFen";

function useCallbackRegisterMove() {
    const {
        movesHistory,
        setMovesHistory,
        actualMove,
        setActualMove,
        colorToPlay,
        setColorWinner,
    } = useGameContext();

    return useCallback(
        (
            completeMove: completeMove,
            pieces: piece[],
            chessApiData?: PostChessApiResponse
        ) => {
            // Do the move
            pieces = doMove(completeMove, pieces);

            // Add the move to the history
            completeMove.check = isCheck(invertColor(colorToPlay), pieces);
            const fen = getFen(
                pieces,
                completeMove,
                invertColor(colorToPlay),
                movesHistory,
                actualMove
            );
            movesHistory[actualMove].chessApiData = chessApiData;
            setMovesHistory([
                ...movesHistory.slice(0, actualMove + 1),
                {
                    lastMove: completeMove,
                    pieces: pieces,
                    fen: fen,
                },
            ]);
            setActualMove((prev) => prev + 1);
            setColorWinner(null);
        },
        [
            movesHistory,
            setMovesHistory,
            actualMove,
            setActualMove,
            colorToPlay,
            setColorWinner,
        ]
    );
}

export default useCallbackRegisterMove;
