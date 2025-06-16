import defaultBoard from "../assets/defaultBoard";
import invertBoard from "../utils/invertBoard";
import useGameContext from "./useGameContext";

function useDefaultBoard(invert?: boolean) {
    const { invertedColor } = useGameContext();

    if (invertedColor) {
        if (invert) return structuredClone(defaultBoard);
        return invertBoard(structuredClone(defaultBoard));
    }
    if (invert) return invertBoard(structuredClone(defaultBoard));
    return structuredClone(defaultBoard);
}

export default useDefaultBoard;
