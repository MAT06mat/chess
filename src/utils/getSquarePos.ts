function getSquarePos(
    event: React.MouseEvent<HTMLDivElement>,
    board: HTMLDivElement,
    inverted: boolean
): { x: number; y: number } {
    const offsetX = board.getBoundingClientRect().left + window.scrollX;
    const offsetY = board.getBoundingClientRect().top + window.scrollY;
    const relX = event.clientX - offsetX;
    const relY = event.clientY - offsetY;
    const x = Math.floor(relX / (board.clientWidth / 8));
    const y = Math.floor(8 - relY / (board.clientHeight / 8));
    if (inverted) {
        return { x: 7 - x, y: 7 - y };
    }
    return { x, y };
}

export default getSquarePos;
