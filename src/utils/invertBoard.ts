import piece from "../types/piece";

function invertBoard(board: piece[]) {
    return board.map((p) => {
        p.y = 7 - p.y;
        p.id += 64;
        return p;
    });
}

export default invertBoard;
