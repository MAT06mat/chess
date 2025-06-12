import { completeMove } from "../types";

interface piecesNotationInterface {
    p: string;
    n: string;
    b: string;
    q: string;
    k: string;
}

const piecesNotation = {
    p: "",
    r: "R",
    n: "N",
    b: "B",
    q: "Q",
    k: "K",
};

const columnsNotation = "abcdefgh";

function getPiece(p: string) {
    return piecesNotation[p as keyof piecesNotationInterface];
}

function getCol(n: number) {
    return columnsNotation[n ? n : 0];
}

function getChessNotation(move: completeMove) {
    const p = move.piece.type[1];
    const x = move.toX;
    const y = move.toY + 1;
    const capture = move.capture ? "x" : "";
    const check = move.checkMate ? "#" : move.check ? "+" : "";

    let pcol = "";
    if (p === "p" && capture === "x") {
        pcol = getCol(move.fromX);
    }

    let special = "";
    if (move.special === "enPassant") {
        special = " e.p.";
    } else if (move.special === "promotion" && move.toPiece) {
        special = "=" + getPiece(move.toPiece.type[1]);
    } else if (move.special === "castling") {
        if (x === 6) return "0-0";
        return "0-0-0";
    }

    return getPiece(p) + pcol + capture + getCol(x) + y + check + special;
}

export default getChessNotation;
