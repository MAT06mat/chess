import { useSettingsStore } from "../../stores/useSettingsStore";
import { CompleteMove, Piece, PieceSymbol } from "../../types";

interface PromotionProps {
    setPromotionBoxVisible: React.Dispatch<React.SetStateAction<boolean>>;
    nextMoveRef: React.MutableRefObject<CompleteMove | null>;
}

function PromotionBox({ setPromotionBoxVisible, nextMoveRef }: PromotionProps) {
    const invertedColor = useSettingsStore((state) => state.invertedColor);
    const playerColor = useSettingsStore((state) => state.playerColor);
    if (!nextMoveRef.current) return;

    function handleClose() {
        setPromotionBoxVisible(false);
        nextMoveRef.current = null;
    }

    function handleClick(event: React.MouseEvent) {
        const pieceComplete = event.currentTarget.className.split(" ")[3];
        const pieceColor = pieceComplete[0];
        const pieceType = pieceComplete[1];
        if (!nextMoveRef.current) return;
        const newPiece: Piece = {
            type: pieceType as PieceSymbol,
            color: pieceColor as "w" | "b",
            x: nextMoveRef.current.fromX,
            y: nextMoveRef.current.fromY,
            id: nextMoveRef.current.piece.id,
            hasMoved: true,
        };
        nextMoveRef.current.toPiece = newPiece;
        setPromotionBoxVisible(false);
    }

    const color = nextMoveRef.current.piece.color;
    const top = color !== playerColor;
    const coordX = invertedColor
        ? 7 - nextMoveRef.current.toX
        : nextMoveRef.current.toX;
    const coordY = invertedColor
        ? 7 - nextMoveRef.current.toY
        : nextMoveRef.current.toY;

    const style = {
        left: `${coordX * 12.5}%`,
        bottom: `${coordY * 12.5 + (top ? 44 : 0)}%`,
    };

    const piecesToDisplay = ["q", "r", "n", "b"];

    return (
        <div className="promotion-box in-board" style={style}>
            {piecesToDisplay.map((p) => {
                return (
                    <div
                        key={p}
                        className={
                            "promotion-piece piece in-board " + color + p
                        }
                        onClick={handleClick}
                    />
                );
            })}
            <div className="close-button in-board" onClick={handleClose}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clipPath="url(#clip0_429_11083)">
                        <path
                            d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006"
                            stroke="#8b8987"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_429_11083">
                            <rect width="24" height="24" fill="#8b8987" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

export default PromotionBox;
