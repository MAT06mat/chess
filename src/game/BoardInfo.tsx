import { CSSProperties } from "react";
import useGameContext from "../hooks/useGameContext";

interface BoardInfoProps {
    x: number;
    y: number;
    className?: string;
    borderWidth?: string;
}

function BoardInfo({ x, y, className, borderWidth }: BoardInfoProps) {
    const { invertedColor } = useGameContext();

    const style: CSSProperties = invertedColor
        ? {
              left: `${(7 - x) * 12.5}%`,
              bottom: `${(7 - y) * 12.5}%`,
              borderWidth: borderWidth,
          }
        : {
              left: `${x * 12.5}%`,
              bottom: `${y * 12.5}%`,
              borderWidth: borderWidth,
          };

    return <div className={"in-board " + className} style={style} />;
}

export default BoardInfo;
