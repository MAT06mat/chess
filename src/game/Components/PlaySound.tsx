import { useEffect } from "react";
import playSound from "../../utils/playSound";
import { useLastMove } from "../../stores/useBoardSelectors";

function PlaySound() {
    const lastMove = useLastMove();

    useEffect(() => {
        if (lastMove?.checkMate) {
            playSound("game-end");
        } else if (lastMove?.check) {
            playSound("move-check");
        } else if (lastMove?.capture) {
            playSound("capture");
        } else if (lastMove?.special === "promotion") {
            playSound("promote");
        } else if (lastMove?.special === "castling") {
            playSound("castle");
        } else if (lastMove) {
            playSound("move-self");
        }
    }, [lastMove]);

    return null;
}

export default PlaySound;
