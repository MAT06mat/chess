import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    light?: boolean;
    children?: ReactNode;
}

function GreyButton({
    className = "",
    text,
    light,
    children,
    ...props
}: Props) {
    return (
        <button
            className={
                (light ? "grey-button light-grey " : "grey-button ") + className
            }
            {...props}
        >
            {children}
            {text ? <span className="text">{text}</span> : null}
        </button>
    );
}

export default GreyButton;
