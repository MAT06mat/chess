function invertColor(color: string | undefined): "w" | "b" {
    return color === "w" ? "b" : "w";
}

export default invertColor;
