import { useState, useEffect } from "react";

function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia("(max-width: 768px)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Pour compatibilité avec tous les navigateurs modernes
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isMobile;
}

export default useIsMobile;
