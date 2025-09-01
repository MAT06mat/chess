import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import TextBox from "./Components/ui/TextBox";
import GreenButton from "./Components/ui/GreenButton";

export { ErrorBoundary };
export function ErrorFallback({ error }: FallbackProps) {
    const clearAllCookies = () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(
                    /=.*/,
                    `=;expires=${new Date(0).toUTCString()};path=/`
                );
        });
        window.location.reload();
    };

    return (
        <div className="error-boundary-wrapper">
            <div className="error-boundary">
                <h1>Oops, something went wrong!</h1>
                <div>
                    <h2>Error:</h2>
                    <TextBox text={error.message} />
                    <p>This might be caused by corrupted cookies.</p>
                    <GreenButton
                        onClick={clearAllCookies}
                        text="Clear cookies and reload"
                    />
                </div>
            </div>
        </div>
    );
}
