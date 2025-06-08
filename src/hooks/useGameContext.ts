import { useContext } from "react";
import { GameContext } from "../context/GameContext";

function useGameContext() {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error(
            "This component must be used within a GameContext.Provider"
        );
    }
    return game;
}

export default useGameContext;
