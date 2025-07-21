import { usePieces } from "../../stores/useBoardSelectors";
import { useSettingsStore } from "../../stores/useSettingsStore";
import BoardInfo from "./BoardInfo";

function Pieces() {
    const pieces = usePieces();
    const invertedColor = useSettingsStore((state) => state.invertedColor);

    return pieces.map((piece) => (
        <BoardInfo
            className={"piece " + piece.color + piece.type}
            invertedColor={invertedColor}
            x={piece.x}
            y={piece.y}
            key={invertedColor ? piece.id + 64 : piece.id}
        />
    ));
}

export default Pieces;
