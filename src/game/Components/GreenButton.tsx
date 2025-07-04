import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    large?: boolean;
}

function GreenButton({ className = "", large, text, ...props }: Props) {
    const buttonClass = large ? "large-green-button" : "green-button";
    return (
        <button className={buttonClass + " " + className} {...props}>
            {text}
        </button>
    );
}

export default GreenButton;
