import { ButtonHTMLAttributes } from "react";
import "../../styles/Components.scss";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    large?: boolean;
}

function GreenButton({
    className = "",
    large,
    text,
    children,
    ...props
}: Props) {
    const buttonClass = large ? "large-green-button" : "green-button";
    return (
        <button className={buttonClass + " " + className} {...props}>
            {children}
            {text}
        </button>
    );
}

export default GreenButton;
