import React, { useCallback, useEffect, useState } from "react";
import useGameContext from "./useGameContext";
import useCallbackRegisterMove from "./useCallbackRegisterMove";
import getSquarePos from "../utils/getSquarePos";
import { CompleteMove, Piece, RelativeMove } from "../types";
import getcompleteMove from "../utils/moves/getCompleteMove";
import {
    getSquare,
    findPieceAt,
    isPieceSelectable,
    getValidMoveTo,
} from "../utils/boardUtils";

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

    const clearSelection = useCallback(() => {
        setSelectedPiece(null);
        setLastClick(null);
        setPieceId(null);
    }, [setSelectedPiece]);

    const toggleLastPieceSelected = useCallback(() => {
        if (pieceId === null && !isSandBox) {
            setLastClick(null);
            setPieceId(selectedPiece?.id ?? null);
        } else {
            clearSelection();
        }
    }, [pieceId, isSandBox, selectedPiece, clearSelection]);

    const handleBoardMouseDown = useCallback(
        (event: MouseEvent, identifier?: number) => {
            if (
                promotionBoxVisible &&
                event.target === promotionCloseRef.current
            ) {
                setNextMove(null);
                setPromotionBoxVisible(false);
                return;
            }

            const pos = getSquarePos(event, boardRef.current, invertedColor);
            if (!pos) return;

            setLastClick({ ...pos, button: event.button, identifier });

            if (event.button === 0) {
                if (shapes) {
                    movesHistory[actualMove].shapes = [];
                    setMovesHistory([...movesHistory]);
                }

                const piece = findPieceAt(pos, pieces);
                const move = getValidMoveTo(
                    pos,
                    selectedPiece,
                    displayMoves,
                    isSandBox
                );

                if (
                    piece &&
                    isPieceSelectable(
                        piece,
                        gameStatus,
                        colorToPlay,
                        playerColor
                    ) &&
                    !move
                ) {
                    setSelectedPiece(piece);
                    setDisplayMoves(validMoves.get(piece.id) ?? []);
                    if (pieceId !== piece.id) setPieceId(null);
                } else if (!move) {
                    clearSelection();
                }
            } else if (selectedPiece) {
                setSelectedPiece(null);
            }
        },
        [
            boardRef,
            promotionCloseRef,
            promotionBoxVisible,
            setNextMove,
            setPromotionBoxVisible,
            shapes,
            movesHistory,
            actualMove,
            setMovesHistory,
            setSelectedPiece,
            setDisplayMoves,
            validMoves,
            pieceId,
            selectedPiece,
            invertedColor,
            clearSelection,
            pieces,
            colorToPlay,
            gameStatus,
            playerColor,
            displayMoves,
            isSandBox,
        ]
    );

    const handleBoardMouseUp = useCallback(
        (event: MouseEvent, preventDefault?: () => void) => {
            const pos = getSquarePos(event, boardRef.current, invertedColor);
            if (!pos) {
                clearSelection();
                return;
            }

            if (!lastClick || lastClick.button !== event.button) return;

            if (lastClick.button === 0) {
                if (!selectedPiece) return;
                preventDefault?.();

                const move = getValidMoveTo(
                    pos,
                    selectedPiece,
                    displayMoves,
                    isSandBox
                );
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
                if (gameStatus === "modeSelection") return;
                const from = getSquare(lastClick.x, lastClick.y);
                const to = getSquare(pos.x, pos.y);
                const newShapes = structuredClone(shapes);

                const exists = newShapes.some(
                    (s) => s.from === from && s.to === to
                );
                movesHistory[actualMove].shapes = exists
                    ? newShapes.filter((s) => s.from !== from || s.to !== to)
                    : [...newShapes, { from, to }];

                setMovesHistory([...movesHistory]);
            }
        },
        [
            boardRef,
            invertedColor,
            lastClick,
            selectedPiece,
            setPromotionBoxVisible,
            setNextMove,
            registerMove,
            pieces,
            clearSelection,
            toggleLastPieceSelected,
            shapes,
            movesHistory,
            actualMove,
            gameStatus,
            setMovesHistory,
            displayMoves,
            isSandBox,
        ]
    );

    const handleBoardTouchDown = useCallback(
        (event: TouchEvent) => {
            if (event.touches.length !== 1) return;
            const touch = event.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            handleBoardMouseDown(mouseEvent, touch.identifier);
        },
        [handleBoardMouseDown]
    );

    const handleBoardTouchUp = useCallback(
        (event: TouchEvent) => {
            const touch = event.changedTouches[0];
            if (!lastClick || lastClick.identifier !== touch.identifier) return;
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            function preventDefault() {
                event.preventDefault();
            }
            handleBoardMouseUp(mouseEvent, preventDefault);
        },
        [handleBoardMouseUp, lastClick]
    );

    useEffect(() => {
        window.addEventListener("mousedown", handleBoardMouseDown);
        window.addEventListener("mouseup", handleBoardMouseUp);
        window.addEventListener("touchstart", handleBoardTouchDown, {
            passive: false,
        });
        window.addEventListener("touchend", handleBoardTouchUp);

        return () => {
            window.removeEventListener("mousedown", handleBoardMouseDown);
            window.removeEventListener("mouseup", handleBoardMouseUp);
            window.removeEventListener("touchstart", handleBoardTouchDown);
            window.removeEventListener("touchend", handleBoardTouchUp);
        };
    }, [
        handleBoardMouseDown,
        handleBoardMouseUp,
        handleBoardTouchDown,
        handleBoardTouchUp,
    ]);
};

export default useBoardClickEvent;
