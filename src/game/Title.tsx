import useDefaultBoard from "../hooks/useDefaultBoard";
import useGameContext from "../hooks/useGameContext";
import "../styles/Title.scss";

interface Props {
    onlyComputerScreen?: boolean;
    onlyMobileScreen?: boolean;
}

function Title({ onlyComputerScreen, onlyMobileScreen }: Props) {
    const {
        title,
        movesHistory,
        invertedColor,
        setInvertedColor,
        setMovesHistory,
    } = useGameContext();

    const className = onlyComputerScreen
        ? " computer-screen"
        : onlyMobileScreen
        ? " mobile-screen"
        : "";

    const showColorIcon = movesHistory.length <= 1;
    const defaultBoard = useDefaultBoard(true);

    function onColorClick() {
        setInvertedColor((prev) => !prev);
        setMovesHistory([{ pieces: defaultBoard, lastMove: null }]);
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
