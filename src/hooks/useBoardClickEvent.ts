import React, { useCallback, useEffect, useRef } from "react";
import getSquarePos from "../utils/getSquarePos";
import { CompleteMove, Piece, RelativeMove } from "../types";
import getcompleteMove from "../utils/moves/getCompleteMove";
import {
    getSquare,
    findPieceAt,
    isPieceSelectable,
    getValidMoveTo,
} from "../utils/boardUtils";
import { useBoardStore } from "../stores/useBoardStore";
import {
    useColorToPlay,
    usePieces,
    useShapes,
} from "../stores/useBoardSelectors";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePopupStore } from "../stores/usePopupStore";

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
    nextMoveRef: React.MutableRefObject<CompleteMove | null>
) => {
    const gameStatus = useGameStateStore((state) => state.gameStatus);
    const isSandBox = useGameStateStore((state) => state.isSandBox);

    const history = useBoardStore((state) => state.history);
    const setHistory = useBoardStore((state) => state.setHistory);
    const currentMove = useBoardStore((state) => state.currentMove);
    const pieces = usePieces();
    const shapes = useShapes();
    const colorToPlay = useColorToPlay();
    const registerMove = useBoardStore((state) => state.registerMove);

    const invertedColor = useSettingsStore((state) => state.invertedColor);
    const playerColor = useSettingsStore((state) => state.playerColor);

    const isPopupOpen = usePopupStore((state) => state.isPopupOpen);

    type ClickEvent = {
        x: number;
        y: number;
        button: number;
        identifier?: number;
    } | null;

    const lastClickRef = useRef<ClickEvent>(null);
    const pieceIdRef = useRef<number | null>(null);

    const clearSelection = useCallback(() => {
        setSelectedPiece(null);
        lastClickRef.current = null;
        pieceIdRef.current = null;
    }, [setSelectedPiece]);

    const toggleLastPieceSelected = useCallback(() => {
        if (pieceIdRef.current === null && !isSandBox) {
            lastClickRef.current = null;
            pieceIdRef.current = selectedPiece?.id ?? null;
        } else {
            clearSelection();
        }
    }, [isSandBox, selectedPiece, clearSelection]);

    const handleBoardMouseDown = useCallback(
        (event: MouseEvent, identifier?: number) => {
            if (
                promotionBoxVisible &&
                event.target === promotionCloseRef.current
            ) {
                nextMoveRef.current = null;
                setPromotionBoxVisible(false);
                return;
            }

            const pos = getSquarePos(event, boardRef.current, invertedColor);
            if (!pos || isPopupOpen) return;

            lastClickRef.current = { ...pos, button: event.button, identifier };

            if (event.button === 0) {
                if (shapes && shapes.length !== 0) {
                    const newHistory = [...history];
                    newHistory[currentMove] = {
                        ...history[currentMove],
                        shapes: [],
                    };
                    setHistory(newHistory);
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
                    if (pieceIdRef.current !== piece.id)
                        pieceIdRef.current = null;
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
            nextMoveRef,
            promotionBoxVisible,
            setPromotionBoxVisible,
            shapes,
            history,
            currentMove,
            isPopupOpen,
            setHistory,
            setSelectedPiece,
            setDisplayMoves,
            validMoves,
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

            const lastClick = lastClickRef.current;

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
                        nextMoveRef.current = completeMove;
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
                const updatedShapes = exists
                    ? newShapes.filter((s) => s.from !== from || s.to !== to)
                    : [...newShapes, { from, to }];

                const newHistory = [...history];
                newHistory[currentMove] = {
                    ...history[currentMove],
                    shapes: updatedShapes,
                };

                setHistory(newHistory);
            }
        },
        [
            boardRef,
            invertedColor,
            selectedPiece,
            setPromotionBoxVisible,
            nextMoveRef,
            registerMove,
            pieces,
            clearSelection,
            toggleLastPieceSelected,
            shapes,
            history,
            currentMove,
            gameStatus,
            setHistory,
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
            const lastClick = lastClickRef.current;
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
        [handleBoardMouseUp]
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
