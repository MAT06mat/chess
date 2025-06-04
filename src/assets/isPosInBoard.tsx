function isPosInBoard(x: number, y: number): boolean {
    // Check if the position is within the board limits
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

export default isPosInBoard;
