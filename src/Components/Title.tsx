import { useGameStateStore } from "../services/stores/useGameStateStore";
import "../styles/Title.scss";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function Title({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const title = useGameStateStore((state) => state.title);

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    return <div className={"game-title" + className}>{title}</div>;
}

export default Title;
