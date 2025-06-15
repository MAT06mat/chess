function invertColor(color: string): "w" | "b" {
    return color === "w" ? "b" : "w";
}

export default invertColor;
