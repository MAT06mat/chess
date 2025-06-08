import { useContext } from "react";
import { GameContext } from "../context/GameContext";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function Title({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const game = useContext(GameContext);
    if (!game) {
        throw new Error("Board must be used within a GameContext.Provider");
    }
    const { title } = game;

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    return <div className={"title" + className}>{title}</div>;
}

export default Title;
