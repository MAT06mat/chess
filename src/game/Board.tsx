import { useEffect, useRef, useState } from "react";
import "../styles/board.scss";
import Piece, { piece } from "./Piece";

function Board() {
    const boardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<piece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);

    useEffect(() => {
        setPieces([
            { type: "wn", position: { x: 2, y: 3 } },
            { type: "wk", position: { x: 1, y: 2 } },
            { type: "wr", position: { x: 2, y: 5 } },
            { type: "bk", position: { x: 4, y: 6 } },
        ]);
    }, []);

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        const board = boardRef.current;
        if (board) {
            const offsetX = board.getBoundingClientRect().left + window.scrollX;
            const offsetY = board.getBoundingClientRect().top + window.scrollY;
            const relX = event.clientX - offsetX;
            const relY = event.clientY - offsetY;
            const pos = {
                x: Math.floor(relX / (board.clientWidth / 8) + 1),
                y: Math.floor(9 - relY / (board.clientHeight / 8)),
            };

            // If a piece is selected, move it to the clicked position
            if (selectedPiece) {
                // Check if the position is valid (1-8 for both x and y)
                if (pos.x < 1 || pos.x > 8 || pos.y < 1 || pos.y > 8) {
                    return; // Invalid position, do nothing
                }

                let isValidMove = true;
                const newPieces = pieces.filter((piece) => {
                    const samePos =
                        piece.position.x === pos.x &&
                        piece.position.y === pos.y;

                    if (samePos && isValidMove) {
                        isValidMove = piece.type[0] !== selectedPiece.type[0];
                    }
                    return !(
                        samePos && piece.type[0] !== selectedPiece.type[0]
                    );
                });

                // Update the piece's position
                setPieces(
                    newPieces.map((piece) => {
                        if (piece === selectedPiece && isValidMove) {
                            piece.position = pos;
                        }
                        return piece;
                    })
                );
                setSelectedPiece(null);
            }
        }
    }

    return (
        <div className="board" ref={boardRef} onClick={handleClick}>
            {selectedPiece ? (
                <div
                    className={"highlight"}
                    style={{
                        left: `${(selectedPiece.position.x - 1) * 12.5}%`,
                        bottom: `${(selectedPiece.position.y - 1) * 12.5}%`,
                    }}
                />
            ) : null}
            {pieces.map((piece, index) => (
                <Piece
                    key={index}
                    piece={piece}
                    setSelectedPiece={setSelectedPiece}
                />
            ))}
        </div>
    );
}

export default Board;
