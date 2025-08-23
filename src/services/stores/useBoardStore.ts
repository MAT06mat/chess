import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import getDefaultBoard from "../../utils/getDefaultBoard";
import {
    BoardPosition,
    CompleteMove,
    Piece,
    PostChessApiResponse,
} from "../../types";
import doMove from "../engine/doMove";
import isCheck from "../engine/isCheck";
import getFen from "../../utils/getFen";
import { moveToSan } from "../../utils/formatting";
import { CustomGame } from "./useCustomGameStore";

export const useBoardStore = create(
    persist(
        combine(
            {
                history: [getDefaultBoard()],
                currentMove: 0,
            },
            (set) => {
                return {
                    setHistory: (nextHistory: BoardPosition[]) => {
                        set(() => ({
                            history: [...nextHistory],
                        }));
                    },
                    setCurrentMove: (nextCurrentMove: number) => {
                        set(() => ({
                            currentMove: nextCurrentMove,
                        }));
                    },
                    resetHistory: () => {
                        set(() => ({
                            history: [getDefaultBoard()],
                            currentMove: 0,
                        }));
                    },
                    registerMove: (
                        completeMove: CompleteMove,
                        pieces: Piece[],
                        customGame: CustomGame,
                        chessApiData?: PostChessApiResponse
                    ) => {
                        set((state) => {
                            const currentMove = state.currentMove;

                            // Do the move
                            const history = [
                                ...state.history.slice(0, currentMove + 1),
                            ];
                            const newPieces = doMove(completeMove, [
                                ...pieces.map((p) => ({ ...p })),
                            ]);

                            const lastMove = history[currentMove].lastMove;
                            const lastColor = lastMove?.piece.color ?? "b";

                            // Add the move to the history
                            completeMove.check = isCheck(
                                lastColor,
                                newPieces,
                                customGame
                            );
                            completeMove.san = moveToSan(completeMove);
                            const fen = getFen(
                                newPieces,
                                completeMove,
                                lastColor,
                                history,
                                currentMove
                            );
                            history[currentMove].chessApiData = chessApiData;

                            const newBoard: BoardPosition = {
                                lastMove: completeMove,
                                pieces: newPieces,
                                fen,
                                chessApiData,
                            };

                            history.push(newBoard);

                            if (customGame === "3Players") {
                                const params = new URLSearchParams();
                                params.append(
                                    "history",
                                    JSON.stringify(history)
                                );
                                fetch(
                                    "https://chantemuse.fr/api/chess/3players/registerMove.php",
                                    {
                                        method: "POST",
                                        body: params,
                                    }
                                );
                            }

                            return {
                                history: history,
                                currentMove: state.currentMove + 1,
                            };
                        });
                    },
                    undoMove: (number = 1) => {
                        set((state) => {
                            const history = state.history;
                            if (history.length <= number) return {};
                            const newHistory = history.slice(0, -number);
                            let newCurrentMove = state.currentMove;
                            if (state.currentMove >= history.length - number) {
                                newCurrentMove = history.length - number - 1;
                            }
                            return {
                                history: newHistory,
                                currentMove: newCurrentMove,
                            };
                        });
                    },
                    goToFirstMove: () => {
                        set(() => ({ currentMove: 0 }));
                    },
                    goToLastMove: () => {
                        set((state) => ({
                            currentMove: state.history.length - 1,
                        }));
                    },
                    currentMoveUndo: () => {
                        set((state) => {
                            if (state.currentMove <= 0) return {};
                            return {
                                currentMove: state.currentMove - 1,
                            };
                        });
                    },
                    currentMoveRedo: () => {
                        set((state) => {
                            if (state.currentMove >= state.history.length - 1)
                                return {};
                            return {
                                currentMove: state.currentMove + 1,
                            };
                        });
                    },
                    clearShapes: () => {
                        set((state) => {
                            const newHistory = state.history.map((bp) => ({
                                ...bp,
                                shapes: [],
                            }));
                            return { history: newHistory };
                        });
                    },
                };
            }
        ),
        {
            name: "board-history-storage",
        }
    )
);
