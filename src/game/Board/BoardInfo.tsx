import { CSSProperties } from "react";
import useGameContext from "../../hooks/useGameContext";

interface BoardInfoProps {
    x: number;
    y: number;
    className?: string;
    borderWidth?: string;
}

function BoardInfo({ x, y, className, borderWidth }: BoardInfoProps) {
    const { invertedColor } = useGameContext();

    const coordX = invertedColor ? 7 - x : x;
    const coordY = invertedColor ? 7 - y : y;

    let borderRadius = "";
    if (coordX === 0 && coordY === 0) {
        borderRadius = " radius-bottom-left";
    } else if (coordX === 7 && coordY === 0) {
        borderRadius = " radius-bottom-right";
    } else if (coordX === 0 && coordY === 7) {
        borderRadius = " radius-top-left";
    } else if (coordX === 7 && coordY === 7) {
        borderRadius = " radius-top-right";
    }

    const style: CSSProperties = {
        left: `${coordX * 12.5}%`,
        bottom: `${coordY * 12.5}%`,
        borderWidth: borderWidth,
    };

    className = `in-board${borderRadius} ${className}`;

    return <div className={className} style={style} />;
}

export default BoardInfo;
