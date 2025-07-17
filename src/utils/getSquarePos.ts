import isPosInBoard from "./moves/isPosInBoard";

function getSquarePos(
    event: MouseEvent,
    board: HTMLDivElement | null,
    inverted: boolean
) {
    if (!board) return null;

    const offsetX = board.getBoundingClientRect().left;
    const offsetY = board.getBoundingClientRect().top;
    const relX = event.clientX - offsetX;
    const relY = event.clientY - offsetY;
    const x = Math.floor(relX / (board.clientWidth / 8));
    const y = Math.floor(8 - relY / (board.clientHeight / 8));

    if (!isPosInBoard(x, y)) return null;

    if (inverted) {
        return { x: 7 - x, y: 7 - y };
    }
    return { x, y };
}

export default getSquarePos;
