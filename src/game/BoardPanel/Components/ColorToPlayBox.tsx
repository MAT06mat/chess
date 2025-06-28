import "../../../styles/ColorToPlayBox.scss";

interface Props {
    colorToPlay: "w" | "b";
}

function ColorToPlayBox({ colorToPlay }: Props) {
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
