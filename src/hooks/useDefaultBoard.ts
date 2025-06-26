import defaultBoard from "../assets/defaultBoard";

function useDefaultBoard() {
    return structuredClone(defaultBoard);
}

export default useDefaultBoard;
