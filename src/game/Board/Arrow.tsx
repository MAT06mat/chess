import useGameContext from "../../hooks/useGameContext";

const squareSize = 12.5;
const halfSquare = squareSize / 2;

function positionToCoords(pos: string, invertedColor: boolean) {
    const x = (pos.charCodeAt(0) - "a".charCodeAt(0)) * squareSize + halfSquare;
    const y = 100 - ((parseInt(pos[1], 10) - 1) * squareSize + halfSquare);
    if (!invertedColor) {
        return [x, y];
    }
    return [100 - x, 100 - y];
}

interface ArrowProps {
    from: string;
    to: string;
    color?: "orange" | "blue" | "green";
}

function Arrow({ from, to, color }: ArrowProps) {
    const { invertedColor } = useGameContext();

    const [x, y] = positionToCoords(from, invertedColor);
    const [toX, toY] = positionToCoords(to, invertedColor);
    const dx = toX - x;
    const dy = toY - y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    const transform = `rotate(${angle} ${x} ${y})`;

    const arrow = {
        halfWidth: 1.375,
        halfHeadWidth: 3.25,
        height: length,
        startHeight: 4.5,
        headHight: length - 4.5,
    };

    const points = [
        [x - arrow.halfWidth, y - arrow.startHeight],
        [x - arrow.halfWidth, y - arrow.headHight],
        [x - arrow.halfHeadWidth, y - arrow.headHight],
        [x, y - arrow.height],
        [x + arrow.halfHeadWidth, y - arrow.headHight],
        [x + arrow.halfWidth, y - arrow.headHight],
        [x + arrow.halfWidth, y - arrow.startHeight],
    ]
        .map((point) => point.join(" "))
        .join(", ");

    const arrowId = `arrow-${from}${to}`;

    let fill = "rgba(255, 170, 0, 0.8)";
    if (color === "blue") {
        fill = "rgba(72, 193, 249, 0.8)";
    } else if (color === "green") {
        fill = "rgba(150, 190, 70, 0.8)";
    }

    const style = {
        fill: fill,
        opacity: 0.8,
    };
    const className = "arrow";
    return (
        <polygon
            id={arrowId}
            data-arrow={from + to}
            className={className}
            points={points}
            style={style}
            transform={transform}
        />
    );

    return (
        <polygon
            id="arrow-e4c5"
            data-arrow={from + to}
            className="arrow"
            transform="rotate(90 56.25 56.25) scale(-1, 1) translate(-112.5, 0)"
            points="54.875 60.75,
    54.875 82.625,
    64.25 82.625,
    64.25 84.5,
    68.75 81.25,
    64.25 78,
    64.25 79.875,
    57.625 79.875,
    57.625 60.75"
            style={{ fill: "rgba(255, 170, 0, 0.8)", opacity: 0.8 }}
        />
    );
}

export type { ArrowProps };
export default Arrow;
