import { CSSProperties, memo } from "react";
import { useCustomGameStore } from "../../services/stores/useCustomGameStore";
import { invertCoords } from "../../utils/helpers";

interface BoardInfoProps {
    x: number;
    y: number;
    invertedColor: boolean;
    className?: string;
    borderWidth?: string;
}

function BoardInfo({
    x,
    y,
    invertedColor,
    className,
    borderWidth,
}: BoardInfoProps) {
    const customGame = useCustomGameStore((state) => state.customGame);
    const customGameData = useCustomGameStore((state) => state.customGameData);

    if (customGame === "3Players" && customGameData) {
        if (
            (customGameData.playSide === "white1" && x >= 4) ||
            (customGameData.playSide === "white2" && x < 4)
        ) {
            return null;
        }
    }

    const coords = invertedColor ? invertCoords({ x, y }) : { x, y };

    let borderRadius = "";
    if (coords.x === 0 && coords.y === 0) {
        borderRadius = " radius-bottom-left";
    } else if (coords.x === 7 && coords.y === 0) {
        borderRadius = " radius-bottom-right";
    } else if (coords.x === 0 && coords.y === 7) {
        borderRadius = " radius-top-left";
    } else if (coords.x === 7 && coords.y === 7) {
        borderRadius = " radius-top-right";
    }

    const style: CSSProperties = {
        left: `${coords.x * 12.5}%`,
        bottom: `${coords.y * 12.5}%`,
        borderWidth: borderWidth,
    };

    className = `in-board${borderRadius} ${className}`;

    return <div className={className} style={style} />;
}

export default memo(BoardInfo);
