import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

function GreenButton({ className = "", text, ...props }: Props) {
    return (
        <button className={"green-button " + className} {...props}>
            {text}
        </button>
    );
}

export default GreenButton;
