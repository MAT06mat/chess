import useGameContext from "../../hooks/useGameContext";
import "../../styles/Title.scss";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function Title({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const { title } = useGameContext();

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    return <div className={"game-title" + className}>{title}</div>;
}

export default Title;
