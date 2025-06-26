import { useCallback } from "react";
import useGameContext from "./useGameContext";
import piece from "../types/piece";
import { completeMove, move } from "../types";
import isCheck from "../utils/isCheck";
import invertColor from "../utils/invertColor";
import doMove from "../utils/moves/doMove";

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
        (completeMove: completeMove, pieces: piece[]) => {
            // Do the move
            const move: move = {
                x: completeMove.toX - completeMove.fromX,
                y: completeMove.toY - completeMove.fromY,
                group: -1,
            };
            const selectedPiece = pieces.find(
                (piece) =>
                    piece.x === completeMove.fromX &&
                    piece.y === completeMove.fromY
            );
            if (!selectedPiece) return;
            pieces = doMove(move, selectedPiece, pieces);

            // Add the move to the history
            completeMove.check = isCheck(invertColor(colorToPlay), pieces);
            setMovesHistory([
                ...movesHistory.slice(0, actualMove + 1),
                {
                    lastMove: completeMove,
                    pieces: pieces,
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
