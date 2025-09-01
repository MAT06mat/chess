import { Outlet } from "react-router";
import { usePersistedState } from "../hooks/usePersistedSate";
import { ErrorBoundary, ErrorFallback } from "../ErrorBoundary.tsx";

function PageLayout() {
    const [footer, setFooter] = usePersistedState("footer", true);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Outlet />
            <div
                className={"footer" + (footer ? " computer-screen " : "")}
                onClick={() => setFooter(!footer)}
            >
                This is not the official site of Chess.com, we are not
                affiliated with Chess.com in any way.{" "}
                <a href="https://github.com/MAT06mat/chess" target="_blanck">
                    See more
                </a>
            </div>
        </ErrorBoundary>
    );
}

export default PageLayout;
