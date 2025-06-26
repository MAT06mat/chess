import useCallbackResetChessBoard from "../hooks/useCallbackResetChessBoard";
import useGameContext from "../hooks/useGameContext";
import "../styles/Title.scss";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function Title({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const { title, movesHistory, invertedColor, setInvertedColor } =
        useGameContext();

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    const showColorIcon = movesHistory.length <= 1;

    const resetChessBoard = useCallbackResetChessBoard();

    function onColorClick() {
        setInvertedColor((prev) => !prev);
        resetChessBoard();
    }

    return (
        <div className={"game-title" + className}>
            {showColorIcon ? (
                <div
                    className={"color-icon " + (invertedColor ? "b" : "")}
                    onClick={onColorClick}
                />
            ) : null}
            {title}
        </div>
    );
}

export default Title;
