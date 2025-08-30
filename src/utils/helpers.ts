import { BoardPosition, GameStatus, Piece, RelativeMove } from "../types";

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

export const isDraw = (history: BoardPosition[]): string => {
    const counts: Record<string, number> = {};

    for (const { fen } of history) {
        // Only keep [pieces, turn, castling, en passant]
        const key = fen.split(" ").slice(0, 4).join(" ");
        counts[key] = (counts[key] || 0) + 1;
        if (counts[key] >= 3) {
            return "by Threefold repetition";
        }
    }

    const [board, , , , halfmove] = history[0].fen.split(" ");
    const halfmoveClock = parseInt(halfmove, 10);

    // Rule of 50 moves: 100 half-moves without capture or pawn move
    if (halfmoveClock >= 100) {
        return "by Rule of 50 moves";
    }

    // Remove digits and slashes -> get all pieces as array
    const pieces = board.replace(/\d|\/+/g, "").split("");

    // Separate non-king pieces
    const nonKings = pieces.filter((p) => p.toLowerCase() !== "k");
    const white = nonKings.filter((p) => p === p.toUpperCase());
    const black = nonKings.filter((p) => p === p.toLowerCase());
    const total = nonKings.length;

    // Automatic draw cases
    if (total === 0) return "by Insufficient material"; // King vs King

    if (total === 1) {
        const p = nonKings[0].toLowerCase();
        if (p === "n" || p === "b") {
            return "by Insufficient material";
        }
    }

    if (total === 2 && white.length === 1 && black.length === 1) {
        if (white[0].toLowerCase() === "b" && black[0].toLowerCase() === "b") {
            if (bishopsSameColor(board)) {
                return "by Insufficient material";
            }
        }
    }

    return "";
};

// Helper: check if both bishops are on the same color square
function bishopsSameColor(board: string): boolean {
    const bishops: { piece: string; square: [number, number] }[] = [];
    const rows = board.split("/");

    rows.forEach((row, r) => {
        let file = 0;
        for (const c of row) {
            if (/\d/.test(c)) {
                file += +c;
            } else {
                if (c.toLowerCase() === "b")
                    bishops.push({ piece: c, square: [r, file] });
                file++;
            }
        }
    });

    if (bishops.length !== 2) return false;
    const color = ([r, f]: number[]) => (r + f) % 2; // 0 = dark, 1 = light
    return color(bishops[0].square) === color(bishops[1].square);
}

export const isPlayingStatus = (status: GameStatus) => {
    return status.includes("playing");
};
