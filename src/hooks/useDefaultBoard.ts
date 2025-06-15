import defaultBoard from "../assets/defaultBoard";
import invertBoard from "../utils/invertBoard";
import useGameContext from "./useGameContext";

function useDefaultBoard() {
    const { invertedColor } = useGameContext();

    if (invertedColor) {
        return invertBoard(structuredClone(defaultBoard));
    }
    return structuredClone(defaultBoard);
}

export default useDefaultBoard;
