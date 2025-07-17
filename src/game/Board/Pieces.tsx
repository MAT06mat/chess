import useGameContext from "../../hooks/useGameContext";
import BoardInfo from "./BoardInfo";

function Pieces() {
    const { movesHistory, actualMove, invertedColor } = useGameContext();
    const pieces = movesHistory[actualMove].pieces;

    return pieces.map((piece) => (
        <BoardInfo
            className={"piece " + piece.color + piece.type}
            key={invertedColor ? piece.id + 64 : piece.id}
            x={piece.x}
            y={piece.y}
        />
    ));
}

export default Pieces;
