import { usePieces } from "../../../services/stores/useBoardSelectors";
import { useBoardStore } from "../../../services/stores/useBoardStore";
import { useSettingsStore } from "../../../services/stores/useSettingsStore";
import BoardInfo from "./BoardInfo";

function Pieces() {
    const pieces = usePieces();
    const invertedColor = useSettingsStore((state) => state.invertedColor);
    const pieceTheme = useSettingsStore((state) => state.piecesTheme);
    const pieceGrab = useBoardStore((state) => state.pieceGrab);

    return pieces.map((piece) => (
        <BoardInfo
            className="piece"
            invertedColor={invertedColor}
            x={piece.x}
            y={piece.y}
            key={invertedColor ? piece.id + 64 : piece.id}
            grabPos={pieceGrab.id === piece.id ? pieceGrab.pos : undefined}
            propStyle={{
                backgroundImage: `url("https://www.chess.com/chess-themes/pieces/${pieceTheme}/150/${
                    piece.color + piece.type
                }.png")`,
            }}
        />
    ));
}

export default Pieces;
