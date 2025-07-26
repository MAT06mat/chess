import { GameStatus, Piece, RelativeMove } from "../types";

type Coords = {
    x: number;
    y: number;
};

export function invertColor(color: string | undefined): "w" | "b" {
    return color === "w" ? "b" : "w";
}

export const invertCoords = (coord: Coords) => ({
    x: 7 - coord.x,
    y: 7 - coord.y,
});

export const isCoordsInBoard = ({ x, y }: Coords) =>
    x >= 0 && x < 8 && y >= 0 && y < 8;

export const findPieceAt = (coords: Coords, pieces: Piece[]) =>
    pieces.find((p) => p.x === coords.x && p.y === coords.y) ?? null;

export const isPieceSelectable = (
    piece: Piece,
    gameStatus: GameStatus,
    colorToPlay: "w" | "b",
    playerColor: "w" | "b"
) => {
    const isVsBot = gameStatus === "playingVsBot";
    const isVsFriend = gameStatus === "playingVsFriend";
    const isYourTurn = colorToPlay === playerColor;
    const isColorToPlay = piece.color === colorToPlay;
    const isSandBox = gameStatus === "playingSandBox";
    return (
        isSandBox || (isColorToPlay && ((isVsBot && isYourTurn) || isVsFriend))
    );
};

export const getValidMoveTo = (
    coords: Coords,
    selectedPiece: Piece | null,
    displayMoves: RelativeMove[],
    isSandBox: boolean
) => {
    if (!selectedPiece) return null;

    const dx = coords.x - selectedPiece.x;
    const dy = coords.y - selectedPiece.y;

    if (isSandBox && (dx || dy)) {
        return { x: dx, y: dy };
    }

    return displayMoves.find((m) => m.x === dx && m.y === dy) ?? null;
};
