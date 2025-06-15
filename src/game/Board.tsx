import { useCallback, useEffect, useRef, useState } from "react";
import Piece, { piece } from "./Piece";
import BoardInfo from "./BoardInfo";
import doMove from "../utils/doMove";
import getSquarePos from "../utils/getSquarePos";
import PromotionBox from "./PromotionBox";
import { completeMove, move } from "../types";
import BoardCoordinates from "../assets/svg/BoardCoordinates";
import useGameContext from "../hooks/useGameContext";
import "../styles/Board.scss";
import getValidMoves from "../utils/getValidMoves";
import isCheck from "../utils/isCheck";
import WinnerPopup from "./WinnerPopup";
import invertColor from "../utils/invertColor";

function Board() {
    const {
        movesHistory,
        setMovesHistory,
        actualMove,
        setActualMove,
        colorToPlay,
        colorWinner,
        setColorWinner,
        invertedColor,
    } = useGameContext();

    const boardRef = useRef<HTMLDivElement>(null);
    const promotionCloseRef = useRef<HTMLDivElement>(null);
    const [validMoves, setValidMoves] = useState(new Map());
    const [displayMoves, setDisplayMoves] = useState<move[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<piece | null>(null);
    const [promotionBoxVisible, setPromotionBoxVisible] = useState(false);
    const [nextMove, setNextMove] = useState<completeMove | null>(null);

    const pieces = movesHistory[actualMove].pieces;
    const lastMove = movesHistory[actualMove].lastMove;

    // Remove the selected piece on board reset
    useEffect(() => {
        setSelectedPiece(null);
    }, [setSelectedPiece, pieces]);

    const addToMovesHistory = useCallback(
        (lastMove: completeMove, pieces: piece[]) => {
            lastMove.check = isCheck(invertColor(colorToPlay), pieces);
            setMovesHistory([
                ...movesHistory.slice(0, actualMove + 1),
                {
                    lastMove: lastMove,
                    pieces: pieces,
                },
            ]);
            setActualMove((prev) => prev + 1);
            setColorWinner(null);
        },
        [
            movesHistory,
            setMovesHistory,
            actualMove,
            setActualMove,
            colorToPlay,
            setColorWinner,
        ]
    );

    useEffect(() => {
        const [map, numberOfMove] = getValidMoves(
            colorToPlay,
            pieces,
            lastMove,
            invertedColor
        );
        setValidMoves(map);
        if (numberOfMove === 0) {
            if (lastMove?.check) {
                setColorWinner(invertColor(colorToPlay));
                lastMove.checkMate = true;
            } else {
                setColorWinner("s");
            }
        }
    }, [
        colorToPlay,
        lastMove,
        pieces,
        setColorWinner,
        colorWinner,
        invertedColor,
    ]);

    useEffect(() => {
        if (!promotionBoxVisible && nextMove) {
            const validMove: move = {
                x: nextMove.toX - nextMove.fromX,
                y: nextMove.toY - nextMove.fromY,
                capture: nextMove.capture,
                check: nextMove.check,
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
        if (!selectedPiece) {
            setDisplayMoves([]);
            return;
        }
        setDisplayMoves(validMoves.get(selectedPiece.id));
    }, [selectedPiece, validMoves, colorWinner]);

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
                const validMove = displayMoves.find(
                    (move) =>
                        move.x === x - selectedPiece.x &&
                        move.y === y - selectedPiece.y
                );

                if (validMove) {
                    const move: completeMove = {
                        fromX: selectedPiece.x,
                        fromY: selectedPiece.y,
                        toX: x,
                        toY: y,
                        capture: validMove.capture,
                        check: validMove.check,
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

    function handlePieceClick(piece: piece) {
        if (
            piece.type[0] !== colorToPlay ||
            (colorWinner && actualMove === movesHistory.length - 1)
        ) {
            return;
        }
        setSelectedPiece(piece);
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
                    <BoardInfo
                        className="highlight"
                        x={selectedPiece.x}
                        y={selectedPiece.y}
                    />
                    {displayMoves.map((move, index) => {
                        return (
                            <BoardInfo
                                className={
                                    move.capture ? "capture-hint" : "hint"
                                }
                                borderWidth={
                                    boardRef.current?.clientWidth
                                        ? boardRef.current?.clientWidth *
                                              0.011 +
                                          "px"
                                        : undefined
                                }
                                key={index}
                                x={move.x + selectedPiece.x}
                                y={move.y + selectedPiece.y}
                            />
                        );
                    })}
                </>
            ) : null}
            {pieces.map((piece) => (
                <Piece
                    key={piece.id}
                    piece={piece}
                    onPieceClick={handlePieceClick}
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
            <WinnerPopup />
        </div>
    );
}

export default Board;
