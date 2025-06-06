import { useEffect, useRef, useState } from "react";
import Piece, { piece } from "./Piece";
import { completeMove, move } from "../assets/getMoves";
import DefaultBoard from "../assets/DefaultBoard";
import BoardInfo from "./BoardInfo";
import getValidMoves from "../assets/getValidMoves";
import doMove from "../assets/doMove";
import getSquarePos from "../assets/getSquarePos";
import PromotionBox from "./PromotionBox";
import "../styles/Board.scss";

function Board() {
    const boardRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<piece[]>([]);
    const [validMoves, setValidMoves] = useState<move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);
    const [lastMove, setLastMove] = useState<completeMove | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<completeMove | null>(null);

    useEffect(() => {
        setPieces(DefaultBoard);
    }, []);

    useEffect(() => {
        if (!promotionBoxVisible && nextMove) {
            setLastMove(nextMove);
            const validMove: move = {
                x: nextMove.toX - nextMove.fromX,
                y: nextMove.toY - nextMove.fromY,
                group: 999,
                special: "promotion",
            };
            setPieces(doMove(validMove, nextMove.piece, pieces));
            setNextMove(null);
        }
    }, [promotionBoxVisible, nextMove, pieces]);

    useEffect(() => {
        setValidMoves(getValidMoves(selectedPiece, pieces, lastMove));
    }, [selectedPiece, pieces, lastMove]);

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (promotionBoxVisible && event.target === boardRef.current) {
            setNextMove(null);
            setPromotionBoxVisible(false);
            return;
        }

        const board = boardRef.current;
        if (board) {
            const { x, y } = getSquarePos(event, board);

            // If a piece is selected, move it to the clicked position
            if (selectedPiece) {
                const validMove = validMoves.find(
                    (move) =>
                        move.x === x - selectedPiece.x &&
                        move.y === y - selectedPiece.y
                );

                if (validMove) {
                    const move = {
                        fromX: selectedPiece.x,
                        fromY: selectedPiece.y,
                        toX: x,
                        toY: y,
                        piece: selectedPiece,
                    };

                    if (validMove.special === "promotion") {
                        setPromotionBoxVisible(true);
                        setNextMove(move);
                    } else {
                        setLastMove(move);
                        setPieces(doMove(validMove, selectedPiece, pieces));
                    }
                }
                setSelectedPiece(null);
            }
        }
    }

    return (
        <div className="board" ref={boardRef} onClick={handleClick}>
            {lastMove ? (
                <>
                    <BoardInfo
                        className="highlight"
                        x={lastMove.toX}
                        y={lastMove.toY}
                    />
                    <BoardInfo
                        className="highlight"
                        x={lastMove.fromX}
                        y={lastMove.fromY}
                    />
                </>
            ) : null}
            {selectedPiece ? (
                <>
                    {lastMove ? (
                        lastMove.toX === selectedPiece.x &&
                        lastMove.toY === selectedPiece.y ? null : (
                            <BoardInfo
                                className="highlight"
                                x={selectedPiece.x}
                                y={selectedPiece.y}
                            />
                        )
                    ) : null}
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
            {promotionBoxVisible ? (
                <PromotionBox
                    x={nextMove ? nextMove.toX : 0}
                    y={nextMove ? nextMove.toY : 0}
                    setPromotionBoxVisible={setPromotionBoxVisible}
                    setPieces={setPieces}
                    setNextMove={setNextMove}
                    nextMove={nextMove}
                />
            ) : null}
        </div>
    );
}

export default Board;
