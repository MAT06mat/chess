interface Props {
    active?: boolean;
    onClick?: () => void;
}

function SwicthButton({ active, onClick }: Props) {
    return (
        <div
            className={"switch-button" + (active ? " active" : "")}
            onClick={onClick}
        >
            <div className="slider" />
        </div>
    );
}

export default SwicthButton;
