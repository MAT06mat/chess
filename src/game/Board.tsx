import { useCallback, useEffect, useRef, useState } from "react";
import Piece, { piece } from "./Piece";
import BoardInfo from "./BoardInfo";
import getValidMoves from "../utils/getValidMoves";
import doMove from "../utils/doMove";
import getSquarePos from "../utils/getSquarePos";
import PromotionBox from "./PromotionBox";
import { completeMove, move } from "../types";
import BoardCoordinates from "../assets/svg/BoardCoordinates";
import useGameContext from "../hooks/useGameContext";
import "../styles/Board.scss";

function Board() {
    const { movesHistory, setMovesHistory, actualMove, setActualMove } =
        useGameContext();

    const boardRef = useRef<HTMLDivElement>(null);
    const promotionCloseRef = useRef<HTMLDivElement>(null);
    const [validMoves, setValidMoves] = useState<move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<completeMove | null>(null);

    const pieces = movesHistory[actualMove].pieces;
    const lastMove = movesHistory[actualMove].lastMove;

    const addToMovesHistory = useCallback(
        (lastMove: completeMove, pieces: piece[]) => {
            setMovesHistory([
                ...movesHistory.slice(0, actualMove + 1),
                {
                    lastMove: lastMove,
                    pieces: pieces,
                },
            ]);
            setActualMove((prev) => prev + 1);
        },
        [movesHistory, setMovesHistory, actualMove, setActualMove]
    );

    useEffect(() => {
        if (!promotionBoxVisible && nextMove) {
            const validMove: move = {
                x: nextMove.toX - nextMove.fromX,
                y: nextMove.toY - nextMove.fromY,
                group: 999,
                special: "promotion",
            };

            const newPieces = structuredClone(pieces).map((piece) =>
                piece.id === nextMove.toPiece?.id ? nextMove.toPiece : piece
            );

            addToMovesHistory(
                nextMove,
                doMove(
                    validMove,
                    nextMove.toPiece ? nextMove.toPiece : nextMove.piece,
                    newPieces
                )
            );
            setNextMove(null);
        }
    }, [promotionBoxVisible, nextMove, pieces, addToMovesHistory]);

    useEffect(() => {
        setValidMoves(getValidMoves(selectedPiece, pieces, lastMove));
    }, [selectedPiece, pieces, lastMove]);

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (promotionBoxVisible && event.target === promotionCloseRef.current) {
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
                        type: validMove.type,
                        special: validMove.special,
                        piece: selectedPiece,
                    };

                    if (move.special === "promotion") {
                        setPromotionBoxVisible(true);
                        setNextMove(move);
                    } else {
                        addToMovesHistory(
                            move,
                            doMove(validMove, selectedPiece, pieces)
                        );
                    }
                }
                setSelectedPiece(null);
            }
        }
    }

    return (
        <div className="board" ref={boardRef} onClick={handleClick}>
            <BoardCoordinates />
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
                                className={
                                    hint.type ? hint.type + "-hint" : "hint"
                                }
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
                <>
                    <div
                        ref={promotionCloseRef}
                        className="promotion-box-close"
                    />
                    <PromotionBox
                        x={nextMove?.toX}
                        y={nextMove?.toY}
                        setPromotionBoxVisible={setPromotionBoxVisible}
                        setNextMove={setNextMove}
                        nextMove={nextMove}
                    />
                </>
            ) : null}
        </div>
    );
}

export default Board;
