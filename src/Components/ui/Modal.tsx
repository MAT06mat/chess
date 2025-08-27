import { ReactNode, useRef } from "react";
import "../../styles/Components.scss";

interface Props {
    children?: ReactNode;
    visible?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function Modal({ children, visible = true, className, onClick }: Props) {
    const closeButtonRef = useRef<HTMLDivElement | null>(null);

    if (!visible) return null;

    function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (event.target === closeButtonRef.current) {
            if (onClick) onClick(event);
        }
    }

    return (
        <div
            className="close-modal-button"
            onClick={handleClick}
            ref={closeButtonRef}
        >
            <div className={"modal " + className}>{children}</div>
        </div>
    );
}

export default Modal;
