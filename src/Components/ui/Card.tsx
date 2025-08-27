import "../../styles/Components.scss";

interface Props {
    icon?: string;
    name?: string;
    description?: string;
    backgroundColor?: string;
    onClick?: () => void;
}

function Card({ icon, name, description, backgroundColor, onClick }: Props) {
    return (
        <div className="card" onClick={onClick}>
            {icon && (
                <div className="card-icon" style={{ backgroundColor }}>
                    <img src={icon} width={120} height={120} />
                </div>
            )}
            <div className="card-body">
                {name && <h2 className="card-name">{name}</h2>}
                {description && (
                    <div className="card-description">{description}</div>
                )}
            </div>
        </div>
    );
}

export default Card;
