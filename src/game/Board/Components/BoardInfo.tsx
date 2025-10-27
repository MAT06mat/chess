import { CSSProperties, memo, useContext, useEffect, useState } from "react";
import { useCustomGameStore } from "../../../services/stores/useCustomGameStore";
import { invertCoords } from "../../../utils/helpers";
import { BoardRefContext } from "../../../services/contexts/BoardRefContext";

function getBoardCoords(
    pos: number[],
    boardRef: React.RefObject<HTMLDivElement> | null
) {
    const board = boardRef?.current;
    if (!board) return { percent: [0, 0], coords: [0, 0] };

    const rect = board.getBoundingClientRect();
    const { left, top, width, height } = rect;

    const clampedX = Math.min(Math.max(pos[0], left), left + width);
    const clampedY = Math.min(Math.max(pos[1], top), top + height);

    const relX = clampedX - left;
    const relY = clampedY - top;

    const x = Math.floor((8 * relX) / width);
    const y = Math.floor(8 - (8 * relY) / height);

    const percentX = ((relX - width / 16) / width) * 100;
    const percentY = (1 - (relY + height / 16) / height) * 100;

    return { percent: [percentX, percentY], coords: [x, y] };
}

interface BoardInfoProps {
    x: number;
    y: number;
    invertedColor: boolean;
    className?: string;
    borderWidth?: string;
    grabPos?: number[];
    propStyle?: React.CSSProperties;
}

function BoardInfo({
    x,
    y,
    invertedColor,
    className,
    borderWidth,
    grabPos,
    propStyle,
}: BoardInfoProps) {
    const customGame = useCustomGameStore((state) => state.customGame);
    const customGameData = useCustomGameStore((state) => state.customGameData);
    const boardRef = useContext(BoardRefContext).ref;

    const [grabPercent, setGrabPercent] = useState<number[] | null>(null);
    const [ungrabCoords, setUngrabCoords] = useState<number[] | null>(null);

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            const pos = [event.clientX, event.clientY];
            const { percent, coords } = getBoardCoords(pos, boardRef);
            setGrabPercent(percent);
            setUngrabCoords(coords);
        }

        function handleTouchMove(event: TouchEvent) {
            if (event.touches.length !== 1) return;
            const touch = event.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            handleMouseMove(mouseEvent);
        }

        if (grabPos) {
            const { percent, coords } = getBoardCoords(grabPos, boardRef);
            setGrabPercent(percent);
            setUngrabCoords(coords);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove);
        }
        return () => {
            setGrabPercent(null);
            setUngrabCoords(null);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [grabPos, boardRef]);

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
        left: `${grabPercent ? grabPercent[0] : coords.x * 12.5}%`,
        bottom: `${grabPercent ? grabPercent[1] : coords.y * 12.5}%`,
        borderWidth: borderWidth,
        ...propStyle,
    };

    className = `in-board${borderRadius} ${className}${
        grabPercent ? " piece-grab" : ""
    }`;

    if (ungrabCoords) {
        return (
            <>
                <div className={className} style={style} />
                <BoardInfo
                    className="ungrab-pos"
                    x={ungrabCoords[0]}
                    y={ungrabCoords[1]}
                    invertedColor={false}
                />
            </>
        );
    }

    return <div className={className} style={style} />;
}

export default memo(BoardInfo);
