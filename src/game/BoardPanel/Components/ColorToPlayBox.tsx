import { useColorToPlay } from "../../../stores/useBoardSelectors";
import "../../../styles/ColorToPlayBox.scss";

function ColorToPlayBox() {
    const colorToPlay = useColorToPlay();

    let text = "";
    if (colorToPlay === "w") {
        text = "White to play";
    } else {
        text = "Black to play";
    }
    return (
        <div className="color-to-play-box">
            <div className={"color " + colorToPlay} />
            <p>{text}</p>
        </div>
    );
}

export default ColorToPlayBox;
