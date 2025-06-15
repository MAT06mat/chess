import { completeMove } from "../types";
import { piece } from "./Piece";

interface PromotionProps {
    x?: number;
    y?: number;
    setPromotionBoxVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setNextMove: React.Dispatch<React.SetStateAction<completeMove | null>>;
    nextMove: completeMove | null;
}

function PromotionBox({
    x = 7,
    y = 7,
    setPromotionBoxVisible,
    setNextMove,
    nextMove,
}: PromotionProps) {
    if (!nextMove) return;

    function handleClose() {
        setPromotionBoxVisible(false);
        setNextMove(null);
    }

    function handleClick(event: React.MouseEvent) {
        const pieceType = event.currentTarget.className.split(" ")[2];
        if (!nextMove) return;
        const newPiece: piece = {
            type: pieceType,
            x: nextMove.fromX,
            y: nextMove.fromY,
            id: nextMove.piece.id,
            hasMoved: true,
        };
        setNextMove((move) => {
            if (move) {
                move.toPiece = newPiece;
            }
            return move;
        });
        setPromotionBoxVisible(false);
    }

    const color = nextMove.piece.type[0];

    const style = {
        left: `${x * 12.5}%`,
        bottom: `${color === "w" ? y * 12.5 : y * 12.5 + 44}%`,
    };

    const piecesToDisplay = ["q", "r", "n", "b"];

    return (
        <div className="promotion-box in-board" style={style}>
            {piecesToDisplay.map((p) => {
                return (
                    <div
                        key={p}
                        className={"promotion-piece in-board " + color + p}
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
