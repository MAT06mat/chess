import { memo } from "react";
import positionToCoords from "../../utils/positionToCoord";

interface ArrowProps {
    from: string;
    to: string;
    color?: "orange" | "blue" | "green";
}

function Arrow({
    from,
    to,
    color,
    invertedColor,
}: ArrowProps & { invertedColor: boolean }) {
    if (to === from) return null;

    const [x, y] = positionToCoords(from, invertedColor, true);
    const [toX, toY] = positionToCoords(to, invertedColor, true);
    const dx = toX - x;
    const dy = toY - y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    let angle = 0;
    let points: number[][] = [];
    if ((absDx === 12.5 && absDy === 25) || (absDx === 25 && absDy === 12.5)) {
        if (dy === 25) {
            angle = 180;
        } else if (dx === 25) {
            angle = 90;
        } else if (dx === -25) {
            angle = -90;
        }

        let xSign = 1;
        const sameSign = dx * dy > 0;
        if ((absDx === 12.5 && sameSign) || (absDy === 12.5 && !sameSign)) {
            xSign = -1;
        }

        const vLenght = 25;
        const hLenght = xSign * 12.5;
        const arrow = {
            halfWidth: 1.375,
            halfHeadWidth: 3.25,
            height: y - vLenght,
            len: x + hLenght,
            startHeight: 4.5,
            headLen: xSign * 4.5,
        };

        points = [
            [x - xSign * arrow.halfWidth, y - arrow.startHeight],
            [x - xSign * arrow.halfWidth, arrow.height - arrow.halfWidth],
            [arrow.len - arrow.headLen, arrow.height - arrow.halfWidth],
            [arrow.len - arrow.headLen, arrow.height - arrow.halfHeadWidth],
            [arrow.len, arrow.height],
            [arrow.len - arrow.headLen, arrow.height + arrow.halfHeadWidth],
            [arrow.len - arrow.headLen, arrow.height + arrow.halfWidth],
            [x + xSign * arrow.halfWidth, arrow.height + arrow.halfWidth],
            [x + xSign * arrow.halfWidth, y - arrow.startHeight],
        ];
    } else {
        const length = Math.sqrt(dx * dx + dy * dy);
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        const arrow = {
            halfWidth: 1.375,
            halfHeadWidth: 3.25,
            height: length,
            startHeight: 4.5,
            headHeight: length - 4.5,
        };

        points = [
            [x - arrow.halfWidth, y - arrow.startHeight],
            [x - arrow.halfWidth, y - arrow.headHeight],
            [x - arrow.halfHeadWidth, y - arrow.headHeight],
            [x, y - arrow.height],
            [x + arrow.halfHeadWidth, y - arrow.headHeight],
            [x + arrow.halfWidth, y - arrow.headHeight],
            [x + arrow.halfWidth, y - arrow.startHeight],
        ];
    }

    const transform = `rotate(${angle} ${x} ${y})`;
    const formatedPoints = points.map((point) => point.join(" ")).join(", ");
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

    return (
        <polygon
            id={arrowId}
            data-arrow={from + to}
            className={"arrow"}
            points={formatedPoints}
            style={style}
            transform={transform}
        />
    );
}

export type { ArrowProps };
export default memo(Arrow);
