const squareSize = 12.5;
const halfSquare = squareSize / 2;

function positionToCoords(
    pos: string,
    invertedColor?: boolean,
    percentage?: boolean
) {
    let x = pos.charCodeAt(0) - "a".charCodeAt(0);
    let y = parseInt(pos[1], 10) - 1;

    if (percentage) {
        x = x * squareSize + halfSquare;
        y = y * squareSize + halfSquare;
        if (invertedColor) {
            return [100 - x, y];
        }
        return [x, 100 - y];
    }

    if (invertedColor) {
        return [7 - x, y];
    }
    return [x, 7 - y];
}

export default positionToCoords;
