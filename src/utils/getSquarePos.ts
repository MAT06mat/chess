import { invertCoords, isCoordsInBoard } from "./helpers";

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
    const coords = { x, y };

    if (!isCoordsInBoard(coords)) return null;

    return inverted ? invertCoords(coords) : coords;
}

export default getSquarePos;
