import { useEffect, useMemo } from "react";
import Arrow, { ArrowProps } from "./Arrow";
import { useBoardStore } from "../../stores/useBoardStore";
import { useShapes } from "../../stores/useBoardSelectors";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useGameStateStore } from "../../stores/useGameStateStore";

function Arrows() {
    const clearShapes = useBoardStore((state) => state.clearShapes);
    const history = useBoardStore((state) => state.history);
    const currentMove = useBoardStore((state) => state.currentMove);
    const shapes = useShapes();

    const invertedColor = useSettingsStore((state) => state.invertedColor);

    const gameReview = useGameStateStore((state) => state.gameReview);

    const allArrows = useMemo(() => {
        const arrows: React.ReactNode[] = [];
        const coords: string[] = [];

        function addArrow(arrow: ArrowProps) {
            const coord = `${arrow.from},${arrow.to}`;
            if (!coords.includes(coord)) {
                coords.push(coord);
                arrows.push(
                    <Arrow
                        {...arrow}
                        invertedColor={invertedColor}
                        key={coord}
                    />
                );
            }
        }

        shapes.forEach(addArrow);

        if (currentMove > 0 && gameReview) {
            const chessApiData = history[currentMove - 1]?.chessApiData;
            if (chessApiData) {
                addArrow({
                    from: chessApiData.from,
                    to: chessApiData.to,
                    color: "green",
                });
            }
        }

        return arrows;
    }, [shapes, currentMove, gameReview, history, invertedColor]);

    useEffect(() => {
        if (gameReview) {
            clearShapes();
        }
    }, [gameReview, clearShapes]);

    return (
        <svg viewBox="0 0 100 100" className="arrows">
            {allArrows}
        </svg>
    );
}

export default Arrows;
