import useGameContext from "../../hooks/useGameContext";
import { CompleteMove, Piece, PieceSymbol } from "../../types";

interface PromotionProps {
    x?: number;
    y?: number;
    setPromotionBoxVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setNextMove: React.Dispatch<React.SetStateAction<CompleteMove | null>>;
    nextMove: CompleteMove | null;
}

function PromotionBox({
    x = 7,
    y = 7,
    setPromotionBoxVisible,
    setNextMove,
    nextMove,
}: PromotionProps) {
    const { invertedColor } = useGameContext();

    if (!nextMove) return;

    function handleClose() {
        setPromotionBoxVisible(false);
        setNextMove(null);
    }

    function handleClick(event: React.MouseEvent) {
        const pieceComplete = event.currentTarget.className.split(" ")[2];
        const pieceColor = pieceComplete[0];
        const pieceType = pieceComplete[1];
        if (!nextMove) return;
        const newPiece: Piece = {
            type: pieceType as PieceSymbol,
            color: pieceColor as "w" | "b",
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

    const color = nextMove.piece.color;

    const style = invertedColor
        ? {
              left: `${(7 - x) * 12.5}%`,
              bottom: `${
                  color === (invertedColor ? "b" : "w")
                      ? (7 - y) * 12.5
                      : (7 - y) * 12.5 + 44
              }%`,
          }
        : {
              left: `${x * 12.5}%`,
              bottom: `${
                  color === (invertedColor ? "b" : "w")
                      ? y * 12.5
                      : y * 12.5 + 44
              }%`,
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
