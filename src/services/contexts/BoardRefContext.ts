import React from "react";

const Default: { ref: React.RefObject<HTMLDivElement> | null } = {
    ref: null,
};

export const BoardRefContext = React.createContext(Default);
