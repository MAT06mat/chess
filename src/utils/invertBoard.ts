import piece from "../types/piece";

function invertBoard(board: piece[]) {
    return board.map((p) => {
        p.y = 7 - p.y;
        p.x = 7 - p.x;
        p.id += 64;
        return p;
    });
}

export default invertBoard;
