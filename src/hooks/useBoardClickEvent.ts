import React, { useRef, useState } from "react";
import useGameContext from "./useGameContext";
import useCallbackRegisterMove from "./useCallbackRegisterMove";
import getSquarePos from "../utils/getSquarePos";
import { CompleteMove, Piece, RelativeMove } from "../types";
import getcompleteMove from "../utils/moves/getCompleteMove";

const useBoardClickEvent = (
    promotionCloseRef: React.RefObject<HTMLDivElement>,
    validMoves: Map<number, RelativeMove[]>,
    displayMoves: RelativeMove[],
    setDisplayMoves: React.Dispatch<React.SetStateAction<RelativeMove[]>>,
    selectedPiece: Piece | null,
    setSelectedPiece: React.Dispatch<React.SetStateAction<Piece | null>>,
    promotionBoxVisible: boolean,
    setPromotionBoxVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setNextMove: React.Dispatch<React.SetStateAction<CompleteMove | null>>
): [JSX.IntrinsicElements["div"], React.RefObject<HTMLDivElement>] => {
    const {
        movesHistory,
        setMovesHistory,
        actualMove,
        colorToPlay,
        invertedColor,
        playerColor,
        gameStatus,
    } = useGameContext();
    const registerMove = useCallbackRegisterMove();

    const boardRef = useRef<HTMLDivElement>(null);
    const pieces = movesHistory[actualMove].pieces;
    const shapes = movesHistory[actualMove].shapes;

    type ClickEvent = {
        x: number;
        y: number;
        button: number;
    } | null;

    const [lastClick, setLastClick] = useState<ClickEvent>(null);
    const [pieceId, setPieceId] = useState<number | null>(null);

    function getSquare(x: number, y: number) {
        return String.fromCharCode(97 + x) + (y + 1);
    }

    function shouldClosePromotionBox(event: React.MouseEvent) {
        return (
            promotionBoxVisible && event.target === promotionCloseRef.current
        );
    }

    function closePromotionBox() {
        setNextMove(null);
        setPromotionBoxVisible(false);
    }

    function getClickPos(event: React.MouseEvent<HTMLDivElement>) {
        const board = boardRef.current;
        return board ? getSquarePos(event, board, invertedColor) : null;
    }

    function findPieceAt(pos: { x: number; y: number }) {
        return pieces.find((p) => p.x === pos.x && p.y === pos.y) ?? null;
    }

    function isPieceSelectable(piece: Piece) {
        const isSandBox = gameStatus === "playingSandBox";
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
        return displayMoves.find(
            (move) =>
                move.x === pos.x - selectedPiece.x &&
                move.y === pos.y - selectedPiece.y
        );
    }

    function toggleLastPieceSelected() {
        if (pieceId === null) {
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

    function handleBoardMouseDown(event: React.MouseEvent<HTMLDivElement>) {
        if (shouldClosePromotionBox(event)) {
            closePromotionBox();
            return;
        }

        const pos = getClickPos(event);
        if (!pos) return;

        setLastClick({
            ...pos,
            button: event.button,
        });

        if (event.button === 0) {
            if (shapes) {
                movesHistory[actualMove].shapes = undefined;
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

    function handleBoardMouseUp(event: React.MouseEvent<HTMLDivElement>) {
        const pos = getClickPos(event);
        if (!pos || !lastClick || lastClick?.button !== event.button) return;

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
            const newShapes = shapes ?? [];

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

    return [
        {
            onMouseDown: handleBoardMouseDown,
            onMouseUp: handleBoardMouseUp,
            onContextMenu: (event) => event.preventDefault(),
            ref: boardRef,
        },
        boardRef,
    ];
};

export default useBoardClickEvent;
