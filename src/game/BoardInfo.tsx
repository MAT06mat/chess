interface BoardInfoProps {
    x: number;
    y: number;
    className?: string;
}

function BoardInfo({ x, y, className }: BoardInfoProps) {
    const style = {
        left: `${x * 12.5}%`,
        bottom: `${y * 12.5}%`,
    };

    return <div className={className} style={style} />;
}

export default BoardInfo;
