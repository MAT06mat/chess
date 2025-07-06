import useGameContext from "../../hooks/useGameContext";
import Arrow, { ArrowProps } from "./Arrow";

function Arrows() {
    const { movesHistory, actualMove, gameReview } = useGameContext();
    const arrows: ArrowProps[] = [];

    let chessApiData = null;
    if (actualMove > 0 && gameReview) {
        chessApiData = movesHistory[actualMove - 1].chessApiData;
    }

    if (
        chessApiData &&
        !arrows.some(
            (arrow) =>
                arrow.from === chessApiData.from && arrow.to === chessApiData.to
        )
    ) {
        arrows.push({
            from: chessApiData.from,
            to: chessApiData.to,
            color: "green",
        });
    }

    return (
        <svg viewBox="0 0 100 100" className="arrows">
            {arrows.map((arrow) => (
                <Arrow {...arrow} key={arrow.from + arrow.to} />
            ))}
        </svg>
    );
}

export default Arrows;
