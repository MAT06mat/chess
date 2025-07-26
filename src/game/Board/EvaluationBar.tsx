import { useEffect, useState } from "react";
import usePositionReview from "../../hooks/usePositionReview";
import "../../styles/EvaluationBar.scss";
import { BoardPosition } from "../../types";
import { useBoardStore } from "../../services/stores/useBoardStore";
import { useSettingsStore } from "../../services/stores/useSettingsStore";
import { useGameStateStore } from "../../services/stores/useGameStateStore";

function evaluationToPercentage(score: number): number {
    if (score >= 100) return 100;
    if (score <= -100) return 0;
    const clamped = Math.max(-10, Math.min(10, score));
    const percentage = 1 / (1 + Math.pow(10, -clamped * 0.25));
    return percentage * 100;
}

function EvaluationBar() {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const gameReview = useGameStateStore((state) => state.gameReview);
    const colorWinner = useGameStateStore((state) => state.colorWinner);

    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const invertedColor = useSettingsStore((state) => state.invertedColor);

    const [percentage, setPercentage] = useState(50);
    const [evaluation, setEvaluation] = useState<number>(0.5);
    const [mate, setMate] = useState<null | number>(null);

    function updatePercentage(
        currentMove: number,
        colorWinner: string | null,
        history: BoardPosition[]
    ) {
        const chessApiData = history[currentMove].chessApiData;
        if (currentMove === history.length - 1) {
            if (colorWinner === "w") {
                setPercentage(100);
            } else if (colorWinner === "b") {
                setPercentage(0);
            }
        } else {
            if (chessApiData?.eval) {
                setPercentage(evaluationToPercentage(chessApiData.eval));
            }
        }

        if (chessApiData?.eval) {
            setEvaluation(chessApiData.eval);
        }

        if (chessApiData?.mate) {
            setMate(chessApiData.mate);
        } else {
            setMate(null);
        }
    }

    usePositionReview(updatePercentage);

    useEffect(() => {
        updatePercentage(currentMove, colorWinner, history);
    }, [currentMove, colorWinner, history]);

    if (gameStatus !== "gameEnd") return;
    if (!gameReview) return;

    let whiteText =
        100 > evaluation && evaluation > 0 ? evaluation.toFixed(1) : "";
    let blackText =
        -100 < evaluation && evaluation < 0 ? (-evaluation).toFixed(1) : "";
    if (mate !== null) {
        if (mate > 0) {
            whiteText = `M${mate}`;
            blackText = "";
        } else if (mate < 0) {
            blackText = `M${-mate}`;
            whiteText = "";
        }
    }
    if (currentMove === history.length - 1) {
        if (colorWinner === "w") {
            whiteText = "1-0";
            blackText = "";
        } else if (colorWinner === "b") {
            blackText = "0-1";
            whiteText = "";
        } else {
            whiteText = "½";
            blackText = "½";
        }
    }

    return (
        <div className={"evaluation-bar" + (invertedColor ? " inverted" : "")}>
            <div className="evaluation-white-text">{whiteText}</div>
            <div className="evaluation-black-text">{blackText}</div>
            <div
                className="evaluation-bar-fill"
                style={{
                    height: `${percentage}%`,
                }}
            />
        </div>
    );
}

export default EvaluationBar;
