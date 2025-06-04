import { useEffect, useRef, useState } from "react";
import "../styles/board.scss";
import Piece, { piece } from "./Piece";
import getHints, { hint } from "../assets/getHints";
import playSound from "./Sounds";
import DefaultBoard from "../assets/DefaultBoard";
import isPosInBoard from "../assets/isPosInBoard";
import BoardInfo from "./BoardInfo";

function Board() {
    const boardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<piece[]>([]);
    const [hints, setHints] = useState<hint[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);

    useEffect(() => {
        setPieces(DefaultBoard);
    }, []);

    useEffect(() => {
        if (selectedPiece) {
            const groupBlocked: number[] =
                selectedPiece.type[1] === "p"
                    ? selectedPiece.type[0] === "w"
                        ? [0, 1, 2]
                        : [3, 4, 5]
                    : [];

            setHints(
                getHints(selectedPiece.type[1]).filter((Hint) => {
                    const x = Hint.x + selectedPiece.x;
                    const y = Hint.y + selectedPiece.y;

                    const isOccupiedSameColor = pieces.some(
                        (piece) =>
                            piece.x === x &&
                            piece.y === y &&
                            (piece.type[0] === selectedPiece.type[0] ||
                                (selectedPiece.type[1] === "p" && Hint.x === 0))
                    );
                    const isOccupiedOtherColor = pieces.some(
                        (piece) =>
                            piece.x === x &&
                            piece.y === y &&
                            piece.type[0] !== selectedPiece.type[0]
                    );

                    Hint.type = undefined;

                    if (selectedPiece.type[1] === "p") {
                        if (Hint.x !== 0 && !isOccupiedOtherColor) {
                            return false;
                        }

                        if (
                            (Hint.y === 2 && selectedPiece.y !== 1) ||
                            (Hint.y === -2 && selectedPiece.y !== 6)
                        ) {
                            return false;
                        }
                    }

                    if (groupBlocked.includes(Hint.group)) {
                        return false;
                    }

                    if (isOccupiedOtherColor || isOccupiedSameColor) {
                        groupBlocked.push(Hint.group);
                        if (isOccupiedSameColor) {
                            return false;
                        } else if (isOccupiedOtherColor) {
                            Hint.type = "capture-hint";
                            return true;
                        }
                    }

                    return isPosInBoard(x, y);
                })
            );
        } else {
            setHints([]);
        }
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
                if (!isPosInBoard(x, y)) {
                    return;
                }

                const isValidMove = hints.some(
                    (hint) =>
                        hint.x === x - selectedPiece.x &&
                        hint.y === y - selectedPiece.y
                );

                if (isValidMove) {
                    const newPieces = pieces.filter((piece) => {
                        return !(piece.x === x && piece.y === y);
                    });

                    if (newPieces.length === pieces.length) {
                        playSound("move-self");
                    } else {
                        playSound("capture");
                    }

                    // Update the piece's position
                    setPieces(
                        newPieces.map((piece) => {
                            if (piece === selectedPiece && isValidMove) {
                                piece.x = x;
                                piece.y = y;
                            }
                            return piece;
                        })
                    );
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
                    {hints.map((hint, index) => {
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
