import { ReactNode, useRef } from "react";
import "../../../styles/Popup.scss";

interface Props {
    children?: ReactNode;
    visible?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function Popup({ children, visible = true, className, onClick }: Props) {
    const closeButtonRef = useRef<HTMLDivElement | null>(null);

    if (!visible) return null;

    function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (event.target === closeButtonRef.current) {
            if (onClick) onClick(event);
        }
    }

    return (
        <div
            className="close-popup-button"
            onClick={handleClick}
            ref={closeButtonRef}
        >
            <div className={"popup " + className}>{children}</div>
        </div>
    );
}

export default Popup;
