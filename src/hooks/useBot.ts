import { useEffect } from "react";
import useGameContext from "./useGameContext";
import { completeMove } from "../types";
import postChessApi from "../utils/postChessApi";
import getFen from "../utils/getFen";
import useCallbackRegisterMove from "./useCallbackRegisterMove";

function useBot() {
    const { invertedColor, colorToPlay, movesHistory, actualMove } =
        useGameContext();

    const registerMove = useCallbackRegisterMove();

    useEffect(() => {
        if (invertedColor ? colorToPlay !== "b" : colorToPlay !== "w") {
            const fen = getFen(movesHistory, colorToPlay, actualMove);
            postChessApi({
                fen: fen,
            }).then((data) => {
                console.log(data);
                const pieces = movesHistory[actualMove].pieces;
                const pfx = "abcdefgh".indexOf(data.from[0]);
                const pfy = data.from[1] - 1;
                const ptx = "abcdefgh".indexOf(data.to[0]);
                const pty = data.to[1] - 1;

                const selectedPiece = pieces.find(
                    (p) => p.x === pfx && p.y === pfy
                );
                console.log("find piece :", selectedPiece);

                if (selectedPiece === undefined) return;

                const completeMove: completeMove = {
                    fromX: pfx,
                    fromY: pfy,
                    toX: ptx,
                    toY: pty,
                    piece: selectedPiece,
                };

                if (data.isCapture) {
                    completeMove.capture = true;
                }

                if (data.isCastling) {
                    completeMove.special = "castling";
                } else if (data.isPromotion) {
                    completeMove.special = "promotion";
                }

                setTimeout(
                    () => registerMove(completeMove, pieces),
                    (Math.random() + 1) * 1000
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movesHistory]);
}

export default useBot;
