import React, { useState } from "react";
import useGameContext from "./useGameContext";
import useCallbackRegisterMove from "./useCallbackRegisterMove";
import getSquarePos from "../utils/getSquarePos";
import { CompleteMove, Piece, RelativeMove } from "../types";
import getcompleteMove from "../utils/moves/getCompleteMove";

const useBoardClickEvent = (
    boardRef: React.RefObject<HTMLDivElement>,
    promotionCloseRef: React.RefObject<HTMLDivElement>,
    validMoves: Map<number, RelativeMove[]>,
    displayMoves: RelativeMove[],
    setDisplayMoves: React.Dispatch<React.SetStateAction<RelativeMove[]>>,
    selectedPiece: Piece | null,
    setSelectedPiece: React.Dispatch<React.SetStateAction<Piece | null>>,
    promotionBoxVisible: boolean,
    setPromotionBoxVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setNextMove: React.Dispatch<React.SetStateAction<CompleteMove | null>>
) => {
    const {
        pieces,
        shapes,
        movesHistory,
        setMovesHistory,
        actualMove,
        colorToPlay,
        invertedColor,
        playerColor,
        gameStatus,
    } = useGameContext();
    const registerMove = useCallbackRegisterMove();
    const isSandBox = gameStatus === "playingSandBox";

    type ClickEvent = {
        x: number;
        y: number;
        button: number;
        identifier?: number;
    } | null;

    const [lastClick, setLastClick] = useState<ClickEvent>(null);
    const [pieceId, setPieceId] = useState<number | null>(null);

    function getSquare(x: number, y: number) {
        return String.fromCharCode(97 + x) + (y + 1);
    }

    function findPieceAt(pos: { x: number; y: number }) {
        return pieces.find((p) => p.x === pos.x && p.y === pos.y) ?? null;
    }

    function isPieceSelectable(piece: Piece) {
        const isVsBot = gameStatus === "playingVsBot";
        const isVsFriend = gameStatus === "playingVsFriend";
        const isYourTurn = colorToPlay === playerColor;
        const isColorToPlay = piece.color === colorToPlay;
        return (
            isSandBox ||
            (isColorToPlay && ((isVsBot && isYourTurn) || isVsFriend))
        );
    }

    function getValidMoveTo(pos: { x: number; y: number }) {
        if (!selectedPiece) return null;
        if (isSandBox) {
            const dx = pos.x - selectedPiece.x;
            const dy = pos.y - selectedPiece.y;
            if (dx || dy) {
                return {
                    x: dx,
                    y: dy,
                };
            }
        }
        return displayMoves.find(
            (move) =>
                move.x === pos.x - selectedPiece.x &&
                move.y === pos.y - selectedPiece.y
        );
    }

    function toggleLastPieceSelected() {
        if (pieceId === null && !isSandBox) {
            setLastClick(null);
            setPieceId(selectedPiece?.id ?? null);
        } else {
            clearSelection();
        }
    }

    function clearSelection() {
        setSelectedPiece(null);
        setLastClick(null);
        setPieceId(null);
    }

    function handleBoardMouseDown(event: MouseEvent, identifier?: number) {
        // Close promotion box if visible
        if (promotionBoxVisible && event.target === promotionCloseRef.current) {
            setNextMove(null);
            setPromotionBoxVisible(false);
            return;
        }

        const pos = getSquarePos(event, boardRef.current, invertedColor);
        if (!pos) return;

        setLastClick({
            ...pos,
            button: event.button,
            identifier,
        });

        if (event.button === 0) {
            if (shapes) {
                movesHistory[actualMove].shapes = [];
                setMovesHistory([...movesHistory]); // Update the state to trigger a re-render
            }

            const piece = findPieceAt(pos);
            const move = getValidMoveTo(pos);
            if (piece && isPieceSelectable(piece) && !move) {
                setSelectedPiece(piece);
                setDisplayMoves(validMoves.get(piece.id) ?? []);
                if (pieceId !== piece.id) {
                    setPieceId(null);
                }
            } else if (!getValidMoveTo(pos)) {
                clearSelection();
            }
        } else if (selectedPiece) {
            setSelectedPiece(null);
        }
    }

    function handleBoardMouseUp(event: MouseEvent) {
        const pos = getSquarePos(event, boardRef.current, invertedColor);
        if (!pos) {
            clearSelection();
            return "notPreventDefault";
        }

        if (!lastClick || lastClick.button !== event.button) return;

        if (lastClick.button === 0) {
            if (!selectedPiece) return;

            const move = getValidMoveTo(pos);
            if (move) {
                const completeMove = getcompleteMove(move, selectedPiece);
                if (completeMove.special === "promotion") {
                    setPromotionBoxVisible(true);
                    setNextMove(completeMove);
                } else {
                    registerMove(completeMove, pieces);
                }
                clearSelection();
            } else {
                toggleLastPieceSelected();
            }
        } else if (lastClick.button === 2) {
            const newShapes = structuredClone(shapes);
            const from = getSquare(lastClick.x, lastClick.y);
            const to = getSquare(pos.x, pos.y);

            if (
                newShapes.some(
                    (shape) => shape.from === from && shape.to === to
                )
            ) {
                movesHistory[actualMove].shapes = newShapes.filter(
                    (shape) => shape.from !== from || shape.to !== to
                );
            } else {
                newShapes.push({
                    from: from,
                    to: to,
                });
                movesHistory[actualMove].shapes = newShapes;
            }
            setMovesHistory([...movesHistory]); // Update the state to trigger a re-render
        }
    }

    window.onmousedown = handleBoardMouseDown;
    window.onmouseup = handleBoardMouseUp;

    function handleBoardTouchDown(event: TouchEvent) {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        handleBoardMouseDown(mouseEvent, touch.identifier);
    }

    function handleBoardTouchUp(event: TouchEvent) {
        const touch = event.changedTouches[0];
        if (lastClick && lastClick.identifier !== touch.identifier) return;
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        if (handleBoardMouseUp(mouseEvent) !== "notPreventDefault") {
            event.preventDefault();
        }
    }

    window.ontouchstart = handleBoardTouchDown;
    window.ontouchend = handleBoardTouchUp;
};

export default useBoardClickEvent;
