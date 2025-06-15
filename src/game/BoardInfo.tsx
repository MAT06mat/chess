import { CSSProperties } from "react";

interface BoardInfoProps {
    x: number;
    y: number;
    className?: string;
    borderWidth?: string;
}

function BoardInfo({ x, y, className, borderWidth }: BoardInfoProps) {
    const style: CSSProperties = {
        left: `${x * 12.5}%`,
        bottom: `${y * 12.5}%`,
        borderWidth: borderWidth,
    };

    return <div className={"in-board " + className} style={style} />;
}

export default BoardInfo;
