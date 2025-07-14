import { ReactNode, useEffect, useState } from "react";
import useGameContext from "../../hooks/useGameContext";
import Arrow, { ArrowProps } from "./Arrow";

function Arrows() {
    const { movesHistory, actualMove, gameReview } = useGameContext();
    const [allArrows, setAllArrows] = useState<ReactNode>(null);

    useEffect(() => {
        const arrows: ReactNode[] = [];
        const coords: string[] = [];

        function addArrow(arrow: ArrowProps) {
            const coord = `${arrow.from},${arrow.to}`;
            if (!coords.includes(coord)) {
                coords.push(coord);
                arrows.push(<Arrow {...arrow} key={coord} />);
            }
        }

        movesHistory[actualMove].shapes?.forEach(addArrow);

        if (actualMove > 0 && gameReview) {
            const chessApiData = movesHistory[actualMove - 1].chessApiData;
            if (chessApiData) {
                addArrow({
                    from: chessApiData.from,
                    to: chessApiData.to,
                    color: "green",
                });
            }
        }

        setAllArrows(arrows);
    }, [movesHistory, actualMove, gameReview]);

    // Reset Shapes on gameReview
    useEffect(() => {
        if (gameReview) {
            movesHistory.forEach((boardPosition) => {
                boardPosition.shapes = undefined;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameReview]);

    return (
        <svg viewBox="0 0 100 100" className="arrows">
            {allArrows}
        </svg>
    );
}

export default Arrows;
