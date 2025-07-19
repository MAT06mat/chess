import { GameStatus, Piece, RelativeMove } from "../types";

export function getSquare(x: number, y: number) {
    return String.fromCharCode(97 + x) + (y + 1);
}

export function findPieceAt(pos: { x: number; y: number }, pieces: Piece[]) {
    return pieces.find((p) => p.x === pos.x && p.y === pos.y) ?? null;
}

export function isPieceSelectable(
    piece: Piece,
    gameStatus: GameStatus,
    colorToPlay: "w" | "b",
    playerColor: "w" | "b"
) {
    const isVsBot = gameStatus === "playingVsBot";
    const isVsFriend = gameStatus === "playingVsFriend";
    const isYourTurn = colorToPlay === playerColor;
    const isColorToPlay = piece.color === colorToPlay;
    const isSandBox = gameStatus === "playingSandBox";
    return (
        isSandBox || (isColorToPlay && ((isVsBot && isYourTurn) || isVsFriend))
    );
}

export function getValidMoveTo(
    pos: { x: number; y: number },
    selectedPiece: Piece | null,
    displayMoves: RelativeMove[],
    isSandBox: boolean
): RelativeMove | null {
    if (!selectedPiece) return null;

    const dx = pos.x - selectedPiece.x;
    const dy = pos.y - selectedPiece.y;

    if (isSandBox && (dx || dy)) {
        return { x: dx, y: dy };
    }

    return displayMoves.find((m) => m.x === dx && m.y === dy) ?? null;
}
