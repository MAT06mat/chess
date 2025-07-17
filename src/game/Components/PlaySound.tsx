import { useEffect } from "react";
import playSound from "../../utils/playSound";
import useGameContext from "../../hooks/useGameContext";

function PlaySound() {
    const { lastMove } = useGameContext();

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
