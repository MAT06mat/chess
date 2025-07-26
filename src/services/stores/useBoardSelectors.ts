import { useBoardStore } from "./useBoardStore";
import { invertColor } from "../../utils/helpers";
import getPiecesScores from "../../utils/getPiecesScores";

export function useCurrentBoard() {
    return useBoardStore((state) => state.history[state.currentMove]);
}

export function usePieces() {
    return useCurrentBoard().pieces;
}

export function useLastMove() {
    return useCurrentBoard().lastMove;
}

export function useShapes() {
    return useCurrentBoard().shapes ?? [];
}

export function useColorToPlay() {
    return invertColor(useLastMove()?.piece.color);
}

export function usePiecesScores() {
    return getPiecesScores(usePieces());
}
