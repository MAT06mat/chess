import getDefaultPieces from "./getDefaultPieces";

function getDefaultBoard() {
    return { pieces: getDefaultPieces(), lastMove: null };
}

export default getDefaultBoard;
