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

    const style: CSSProperties = {
        left: `${coordX * 12.5}%`,
        bottom: `${coordY * 12.5}%`,
        borderWidth: borderWidth,
    };

    return <div className={"in-board " + className} style={style} />;
}

export default BoardInfo;
