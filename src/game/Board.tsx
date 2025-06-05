import { useEffect, useRef, useState } from "react";
import "../styles/board.scss";
import Piece, { piece } from "./Piece";
import { move } from "../assets/getMoves";
import DefaultBoard from "../assets/DefaultBoard";
import BoardInfo from "./BoardInfo";
import getValidMoves from "../assets/getValidMoves";
import doMove from "../assets/doMove";

function Board() {
    const boardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<piece[]>([]);
    const [validMoves, setValidMoves] = useState<move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);

    useEffect(() => {
        setPieces(DefaultBoard);
    }, []);

    useEffect(() => {
        setValidMoves(getValidMoves(selectedPiece, pieces));
    }, [selectedPiece, pieces]);

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        const board = boardRef.current;
        if (board) {
            const offsetX = board.getBoundingClientRect().left + window.scrollX;
            const offsetY = board.getBoundingClientRect().top + window.scrollY;
            const relX = event.clientX - offsetX;
            const relY = event.clientY - offsetY;
            const x = Math.floor(relX / (board.clientWidth / 8));
            const y = Math.floor(8 - relY / (board.clientHeight / 8));

            // If a piece is selected, move it to the clicked position
            if (selectedPiece) {
                const validMove = validMoves.find(
                    (move) =>
                        move.x === x - selectedPiece.x &&
                        move.y === y - selectedPiece.y
                );

                if (validMove) {
                    setPieces(doMove(validMove, selectedPiece, pieces));
                }
                setSelectedPiece(null);
            }
        }
    }

    return (
        <div className="board" ref={boardRef} onClick={handleClick}>
            {selectedPiece ? (
                <>
                    <BoardInfo
                        className="highlight"
                        x={selectedPiece.x}
                        y={selectedPiece.y}
                    />
                    {validMoves.map((hint, index) => {
                        return (
                            <BoardInfo
                                className={hint.type || "hint"}
                                borderWidth={
                                    boardRef.current?.clientWidth
                                        ? boardRef.current?.clientWidth *
                                              0.011 +
                                          "px"
                                        : undefined
                                }
                                key={index}
                                x={hint.x + selectedPiece.x}
                                y={hint.y + selectedPiece.y}
                            />
                        );
                    })}
                </>
            ) : null}
            {pieces.map((piece) => (
                <Piece
                    key={piece.id}
                    piece={piece}
                    setSelectedPiece={setSelectedPiece}
                />
            ))}
        </div>
    );
}

export default Board;
