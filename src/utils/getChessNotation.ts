import { CompleteMove } from "../types";

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

function getPiece(p: string) {
    return piecesNotation[p as keyof piecesNotationInterface];
}

function getCol(n: number) {
    return String.fromCharCode(97 + n);
}

function getChessNotation(move: CompleteMove) {
    const p = move.piece.type;
    const x = move.toX;
    const y = move.toY + 1;
    const capture = move.capture ? "x" : "";
    const check = move.checkMate ? "#" : move.check ? "+" : "";

    let pcol = "";
    if (p === "p" && capture === "x") {
        pcol = getCol(move.fromX);
    }

    let special = "";
    let pro = "";
    if (move.special === "enPassant") {
        special = " e.p.";
    } else if (move.special === "promotion" && move.toPiece) {
        pro = "=" + getPiece(move.toPiece.type);
    } else if (move.special === "castling") {
        if (x === 6) return "0-0" + check;
        return "0-0-0" + check;
    }

    return getPiece(p) + pcol + capture + getCol(x) + y + pro + check + special;
}

export default getChessNotation;
